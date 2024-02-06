const Admin = require('../models/Admin');
const { mongooseToObj, multiMongooseToObjs } = require('../../../util/mongoose');
const bcrypt = require('bcryptjs');

class EmployeeAccountsManagementController {
    //[GET] /admin/taikhoan-nhanvien
    accounts(req, res) {
        Admin.find({})
            .then(docs => {
                const accounts = multiMongooseToObjs(docs);
                res.render('admin/employees-account/accounts', { pageTitle: 'Tài khoản nhân viên', layout: 'admin', accounts })
            })
    }

    //[GET] /admin/taikhoan-nhanvien/add
    add(req, res) {
        res.render('admin/employees-account/add', { pageTitle: 'Thêm tài khoản nhân viên', layout: 'admin' })
    }
}

module.exports = new EmployeeAccountsManagementController;