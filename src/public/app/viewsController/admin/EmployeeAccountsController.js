const Admin = require('../../models/Admin');
const { mongooseToObj, multiMongooseToObjs } = require('../../../../util/mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { isValidPhoneNumber } = require('libphonenumber-js/mobile');

class EmployeeAccountsManagementController {
    //[GET] /admin/taikhoan-nhanvien
    accounts(req, res) {
        Admin.find({ isAdmin: { $ne: 'true' } })
            .then(docs => {
                const accounts = multiMongooseToObjs(docs);
                res.render('admin/employees-account/accounts', { pageTitle: 'Tài khoản nhân viên', layout: 'admin', accounts, isAdmin: req.session.isAdmin, })
            })
    }

    //[GET] /admin/taikhoan-nhanvien/them
    add(req, res) {
        res.render('admin/employees-account/add', { pageTitle: 'Thêm tài khoản nhân viên', layout: 'admin', isAdmin: req.session.isAdmin, })
    }

    //[POST] /admin/taikhoan-nhanvien/them
    async saveNewAccount(req, res) {
        try {
            if (req.body.phoneNumber && !isValidPhoneNumber(req.body.phoneNumber))
                delete req.body.phoneNumber;
            
            const employee = new Admin(req.body);
            const initPassword = generateShortPassword(6);
            employee.initPassword = initPassword;

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(initPassword, salt);
            employee.password = hash;

            await employee.save();
            res.redirect('/admin/taikhoan-nhanvien');
        } catch (error) {
            console.error(error);
            return res.status(400).json({ errors: errors.array() });
        }
    }

    //[PATCH] /admin/taikhoan-nhanvien/xoa
    deleteAccount(req, res) {
        Admin.findByIdAndDelete(req.body.deleteId).then(() => {
            res.redirect('/admin/taikhoan-nhanvien');
        })
    }


}


function generateShortPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const password = [];

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        password.push(characters.charAt(randomIndex));
    }

    return password.join('');
}

module.exports = new EmployeeAccountsManagementController;