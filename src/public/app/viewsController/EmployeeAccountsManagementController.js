const Admin = require('../models/Admin');
const { mongooseToObj, multiMongooseToObjs } = require('../../../util/mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class EmployeeAccountsManagementController {
    //[GET] /admin/taikhoan-nhanvien
    accounts(req, res) {
        Admin.find({ isAdmin: { $ne: 'true' } })
            .then(docs => {
                const accounts = multiMongooseToObjs(docs);
                res.render('admin/employees-account/accounts', { pageTitle: 'Tài khoản nhân viên', layout: 'admin', accounts })
            })
    }

    //[GET] /admin/taikhoan-nhanvien/them
    add(req, res) {
        res.render('admin/employees-account/add', { pageTitle: 'Thêm tài khoản nhân viên', layout: 'admin' })
    }

    //[POST] /admin/taikhoan-nhanvien/them
    saveNewAccount(req, res) {
        const employee = new Admin(req.body);
        const initPassword = generateShortPassword(6);
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                console.error(err);
                return res.status(400).json({ errors: errors.array() });
            }
            bcrypt.hash(initPassword, salt, function (err, hash) {
                if (err) {
                    console.error(err);
                    return res.status(400).json({ errors: errors.array() });
                }
                employee.initPassword = hash;
            });
        });
        employee.save().then(() => {
            res.redirect('/admin/taikhoan-nhanvien');
        })
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