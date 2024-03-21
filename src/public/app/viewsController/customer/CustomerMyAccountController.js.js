const Customer = require('../../models/Customer');
const { mongooseToObj } = require('../../../../util/mongoose');
const bcrypt = require('bcryptjs');
const { isValidPhoneNumber } = require('libphonenumber-js/mobile');

class CustomerAcountManagementController {
    showInfo(req, res, next) {
        console.log('show my info - customer');
        Customer.findById(req.session.user.id)
            .then((user) => {
                const account = {
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    dateOfBirth: user.dateOfBirth,
                }
                res.render('customer/account/info', { pageTitle: 'Tài khoản của tôi', account, cart: res.locals.cart, })
            }).catch(next);
    }

    modify(req, res, next) {
        console.log('modify my info - customer');
        Customer.findById(req.session.user.id)
            .then((user) => {
                const account = mongooseToObj(user);
                account.password = null;
                res.render('customer/account/modify-profile', { pageTitle: 'Sửa tài khoản của tôi', account, cart: res.locals.cart, })
            }).catch(next);
    }

    //[PATCH] /customer/taikhoancuatoi/sua
    saveModify(req, res, next) {
        console.log('save modify my info - customer');
        Customer.findById(req.session.user.id)
            .then(account => {
                account.fullName = req.body.fullName;
                account.address = req.body.address;
                account.dateOfBirth = req.body.dateOfBirth;
                account.save();
                req.session.user = {
                    id: account._id,
                    phoneNumber: account.phoneNumber,
                    fullName: account.fullName,
                }
                res.redirect('/taikhoan/xem');
            }).catch(next);
    }

    changePassword(req, res, next) {
        console.log('change password - customer');
        res.render('customer/account/change-password', { pageTitle: 'Đổi mật khẩu', layout: 'no-header', });
    }

    //[PATCH] /customer/taikhoancuatoi/doimatkhau
    saveChangePassword(req, res, next) {
        console.log('save change password - customer');
        Customer.findById(req.session.user.id)
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
                            res.redirect('/');
                        } else {
                            console.log('Invalid Customer password');
                            res.redirect('back');
                        }
                    });
                }
                else { res.redirect('back'); }
            }).catch(next);
    }
}

module.exports = new CustomerAcountManagementController;