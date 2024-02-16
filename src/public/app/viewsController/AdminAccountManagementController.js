const Admin = require('../models/Admin');
const { mongooseToObj } = require('../../../util/mongoose');
const bcrypt = require('bcryptjs');

class AdminAcountManagementController {
    showInfo(req, res, next) {
        Admin.findById(req.session.manager.id)
            .then((user) => {
                const account = {
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    dateOfBirth: user.dateOfBirth,
                }
                res.render('admin/account/info', { pageTitle: 'Tài khoản của tôi', layout: 'admin', account, isAdmin: req.session.isAdmin, })
            }).catch(next);
    }

    modify(req, res, next) {
        Admin.findById(req.session.manager.id)
            .then((user) => {
                const account = mongooseToObj(user);
                account.password = null;
                res.render('admin/account/modify-profile', { pageTitle: 'Sửa tài khoản của tôi', layout: 'admin', account, isAdmin: req.session.isAdmin, })
            }).catch(next);
    }

    //[PATCH] /admin/taikhoancuatoi/sua
    saveModify(req, res, next) {
        console.log(req.body.dateOfBirth);
        Admin.findById(req.session.manager.id)
            .then(account => {
                account.fullName = req.body.fullName;
                account.phoneNumber = req.body.phoneNumber;
                account.address = req.body.address;
                account.dateOfBirth = req.body.dateOfBirth;
                account.save();
                req.session.manager.fullName = account.fullName;
                res.redirect('/admin/taikhoancuatoi/xem');
            }).catch(next);
    }

    changePassword(req, res, next) {
        res.render('admin/account/change-password', { pageTitle: 'Đổi mật khẩu', layout: 'no-header-footer', isAdmin: req.session.isAdmin, });
    }

    //[PATCH] /admin/taikhoancuatoi/doimatkhau
    saveChangePassword(req, res, next){
        Admin.findById(req.session.manager.id)
            .then(user => {
                if (req.body.password1 === req.body.password2) {
                    bcrypt.compare(req.body.oldPassword, user.password, function (err, isMatch) {
                        if (err) {
                            console.error(err);
                            res.redirect('back');
                            return; 
                        }
                        if (isMatch) {
                            bcrypt.genSalt(10, function (err, salt) {
                                if (err) {
                                    console.error(err);
                                    return res.status(400).json({ errors: errors.array() });
                                }
                                bcrypt.hash(req.body.password1, salt, function (err, hash) {
                                    if (err) {
                                        console.error(err);
                                        return res.status(400).json({ errors: errors.array() });
                                    }
                                    user.password = hash;
                                    user.save();
                                });
                            });
                            res.redirect('/admin');
                        } else {
                            console.log('Invalid admin password');
                            res.redirect('back');
                        }
                    });
                }
                else {res.redirect('back');}
            }).catch(next);
    }
}

module.exports = new AdminAcountManagementController;