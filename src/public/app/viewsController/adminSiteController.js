const Admin = require('../models/Admin');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

class adminSiteController {
    index(req, res) {
        res.render('admin/admin-home', { pageTitle: 'Trang chủ Admin', layout: 'admin', manager: req.session.manager });
    }

    //[GET] /admin/login
    login(req, res) {
        if (req.session.manager)
            res.redirect('/admin');
        else
            res.render('admin/admin-login', { pageTitle: 'Admin đăng nhập', layout: 'no-header-footer' })
    }

    //[POST] /admin/login
    checkLogin(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('validation error');
        }
        const checkPassword = (admin) => {
            bcrypt.compare(req.body.password, admin.password, function (err, isMatch) {
                if (err) {
                    console.error('password err');
                    return res.status(400).json({ errors: errors.array() });
                }
                if (isMatch) {
                    req.session.manager = {
                        id: admin._id,
                        fullName: admin.fullName,
                    };
                    req.session.isAdmin = admin.isAdmin;
                    res.redirect('/admin');
                } else {
                    console.log('Invalid admin password');
                    res.render('admin/admin-login', { pageTitle: 'Admin đăng nhập', layout: 'no-header-footer', error: 'tài khoản hoặc mật khẩu không đúng!', preInput: req.body });
                }
            });
        }
        Admin.findById(req.body.username)
            .then(admin => {
                if (admin)
                    checkPassword(admin);
                else
                    res.render('admin/admin-login', { pageTitle: 'Admin đăng nhập', layout: 'no-header-footer', error: 'tài khoản hoặc mật khẩu không đúng!', preInput: req.body });
            }).catch(() => {
                Admin.findOne({ phoneNumber: req.body.username })
                    .then(admin => {
                        console.log('3');
                        if (admin)
                            checkPassword(admin);
                        else
                            res.render('admin/admin-login', { pageTitle: 'Admin đăng nhập', layout: 'no-header-footer', error: 'tài khoản hoặc mật khẩu không đúng!', preInput: req.body });
                    }).catch(next);
            });
    }


    //[POST] /admin/dangxuat
    logout(req, res) {
        req.session.destroy();
        res.redirect('/admin/dangnhap');
    }


}

module.exports = new adminSiteController;