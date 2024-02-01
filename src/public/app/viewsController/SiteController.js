const Customer = require('../models/Customer');
const Category = require('../models/ProductCategory');
const Type = require('../models/ProductType');
const Product = require('../models/Product');
const {multiMongooseToObjs, mongooseToObj} = require('../../../util/mongoose')
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

class SiteController {
    index(req, res, next) {
        Category.find({})
            .then(categories => {
                const objs = multiMongooseToObjs(categories);
                objs.forEach(category => {
                    Type.find({ categoryId: category._id })
                        .then(types => {
                            const tps = multiMongooseToObjs(types);
                            category.types = tps;
                        })
                        .catch(next);
                });
                Product.find({})
                    .then(products => {
                        res.render('customer/home', { pageTitle: 'Trang chủ', isLoggedin: req.session.isLoggedin, user: req.session.user, categories: objs, products: multiMongooseToObjs(products) });
                    }).catch(next);
            }).catch(next);
    }

    login(req, res) {
        if (req.session.isLoggedin)
            res.redirect('/');
        else
            res.render('customer/login', { pageTitle: 'Đăng nhập', layout: 'no-header', });
    }

    //[POST] /dangnhap
    checkLogin(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Handle validation errors, such as sending an error response
            return res.status(400).json({ errors: errors.array() });
        }
        Customer.findOne({ username: req.body.username })
            .then((customer) => {
                if (!customer) {
                    console.log('User not found');
                    res.render('customer/login', { pageTitle: 'Đăng nhập', layout: 'no-header', error: 'tài khoản hoặc mật khẩu không đúng!', preInput: req.body });
                    return;
                }
                bcrypt.compare(req.body.password, customer.password, function (err, isMatch) {
                    if (err) {
                        console.error(err);
                        return res.status(400).json({ errors: errors.array() });
                    }
                    if (isMatch) {
                        req.session.user = {
                            id: customer._id,
                            name: customer.fullName,
                        };
                        req.session.isLoggedin = true;
                        res.redirect('/');
                    } else {
                        console.log('Invalid password');
                        res.render('customer/login', { pageTitle: 'Đăng nhập', layout: 'no-header', error: 'tài khoản hoặc mật khẩu không đúng!', preInput: req.body })
                    }
                });
            })
            .catch(next);
    }


    signUp(req, res) {
        if (req.session.isLoggedin)
            res.redirect('/');
        else
            res.render('customer/sign-up', { pageTitle: 'Đăng ký', layout: 'no-header', })
    }

    //[POST] /dangky
    checkCreateAccount(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('validation error!');
            return res.status(400).json({ errors: errors.array() });
        }

        const password = req.body.password;
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                console.error(err);
                return res.status(400).json({ errors: errors.array() });
            }
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    console.error(err);
                    return res.status(400).json({ errors: errors.array() });
                }
                req.body.password = hash;
                const customer = new Customer(req.body);
                customer.save();
            });
        });
        res.redirect('/dangnhap');
    }

    //[POST] /dangxuat
    logout(req, res){
        req.session.destroy();
        res.redirect('/');
    }

    notFound(req, res) {
        res.render('not-found', {pageTitle: 'Không tìm thấy trang', layout: 'no-header-footer',});
    }
}

module.exports = new SiteController();
