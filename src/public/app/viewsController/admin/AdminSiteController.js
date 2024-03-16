const Admin = require('../../models/Admin');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

class adminSiteController {
    index(req, res) {
        console.log('home - admin');
        res.redirect('/admin/thongke')
        //res.render('admin/admin-home', { pageTitle: 'Trang chủ Admin', layout: 'admin', isAdmin: req.session.isAdmin, user: req.session.manager });
    }

    //[GET] /admin/login
    login(req, res) {
        console.log('login - admin');
        if (req.session.manager)
            res.redirect('/admin');
        else
            res.render('admin/admin-login', { pageTitle: 'Admin đăng nhập', layout: 'no-header-footer' })
    }

    //[POST] /admin/login
    checkLogin(req, res, next) {
        console.log('check login - admin');
        if (req.session.manager)
            res.redirect('/admin');
        else {
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
                            phoneNumber: admin.phoneNumber,
                        };
                        req.session.isAdmin = admin.isAdmin;
                        console.log('logged in - admin');
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
                            if (admin) {
                                checkPassword(admin);
                            }
                            else
                                res.render('admin/admin-login', { pageTitle: 'Admin đăng nhập', layout: 'no-header-footer', error: 'tài khoản hoặc mật khẩu không đúng!', preInput: req.body });
                        }).catch(() => {
                            res.render('admin/admin-login', { pageTitle: 'Admin đăng nhập', layout: 'no-header-footer', error: 'tài khoản hoặc mật khẩu không đúng!', preInput: req.body });
                        });
                });
        }
    }

    //[POST] /admin/dangxuat
    logout(req, res) {
        console.log('logout - admin');
        req.session.destroy();
        res.redirect('/admin/dangnhap');
    }


}

module.exports = new adminSiteController;