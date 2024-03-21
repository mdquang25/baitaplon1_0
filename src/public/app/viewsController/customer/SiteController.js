const Customer = require('../../models/Customer');
const Category = require('../../models/ProductCategory');
const Type = require('../../models/ProductType');
const Product = require('../../models/Product');
const Cart = require('../../models/Cart');
const { multiMongooseToObjs, mongooseToObj } = require('../../../../util/mongoose')
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Carousel = require('../../models/Carousel');
const { isValidPhoneNumber } = require('libphonenumber-js/mobile');

class SiteController {
    index(req, res, next) {
        console.log('home page - customer');
        Category.find({})
            .then(docs => {
                const objs = multiMongooseToObjs(docs);
                const categories = objs.map(category => {
                    return Type.find({ categoryId: category._id })
                        .then(types => {
                            const tps = multiMongooseToObjs(types);
                            category.types = tps;
                            return category;
                        });
                });
                Promise.all(categories).then(categories => {
                    Promise.all([Product.find({}), Carousel.find({})])
                        .then(([products, carousels]) => {
                            res.render('customer/home', { pageTitle: 'Trang chủ', isLoggedin: req.session.isLoggedin, categories, products: multiMongooseToObjs(products), carousels: multiMongooseToObjs(carousels), });
                        }).catch(next);
                }).catch(next);
            }).catch(next);
    }

    login(req, res) {
        console.log('log in - customer');
        if (req.session.isLoggedin)
            res.redirect('/');
        else {
            res.render('customer/login', { pageTitle: 'Đăng nhập', });
        }
    }

    //[POST] /dangnhap
    checkLogin(req, res, next) {
        console.log('check log in - customer');
        if (req.session.isLoggedin)
            res.redirect('/');
        else {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Handle validation errors, such as sending an error response
                return res.status(400).json({ errors: errors.array() });
            }
            Customer.findOne({ phoneNumber: req.body.phoneNumber })
                .then((customer) => {
                    if (!customer) {
                        console.log('User not found');
                        res.render('customer/login', { pageTitle: 'Đăng nhập', error: 'tài khoản hoặc mật khẩu không đúng!', preInput: req.body });
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
                                phoneNumber: customer.phoneNumber,
                                fullName: customer.fullName,
                                cartId: customer.cartId,
                            };
                            req.session.isLoggedin = true;
                            req.session.save(function (err) {
                                if (err) {
                                    console.log('Session saving error!');
                                    res.redirect('back');
                                } else {
                                    console.log('logged in - customer');
                                    res.redirect('/');
                                }
                            });

                        } else {
                            console.log('Invalid password');
                            res.render('customer/login', { pageTitle: 'Đăng nhập', error: 'tài khoản hoặc mật khẩu không đúng!', preInput: req.body, })
                        }
                    });
                })
                .catch(next);
        }
    }


    signUp(req, res) {
        console.log('sign up - customer');
        if (req.session.isLoggedin)
            res.redirect('/');
        else
            res.render('customer/sign-up', { pageTitle: 'Đăng ký', })
    }

    //[POST] /dangky
    checkCreateAccount(req, res) {
        console.log('check create new account - customer');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('validation error!');
            return res.send({ error: 'input' });
        }

        Customer.findOne({ phoneNumber: req.body.phoneNumber })
            .then(doc => {
                if (doc) {
                    res.send({ error: 'exist' })
                }
                else if (isValidPhoneNumber(req.body.phoneNumber, 'VN')) {
                    const password = req.body.password;
                    bcrypt.genSalt(10, function (err, salt) {
                        if (err) {
                            console.error(err);
                            return res.send({ error: 'system' });
                        }
                        bcrypt.hash(password, salt, function (err, hash) {
                            if (err) {
                                console.error(err);
                                return res.send({ error: 'system' });
                            }
                            req.body.password = hash;
                            const cart = new Cart({
                                productQ_id: [],
                                order_id: [],
                                newProduct: false,
                                newOrderUpdate: false,
                            });
                            cart.save();
                            req.body.cartId = cart._id;
                            const customer = new Customer(req.body);
                            customer.save();
                            console.log('created new account - customer');
                        });
                    });
                    res.send({ created: 1 });
                }
                else
                    res.send({ error: 'phone' });

            })
    }

    //[GET] /dangxuat
    logout(req, res) {
        console.log('log out - customer');
        req.session.destroy();
        res.send({});
    }

    contactUs(req, res, next) {
        res.render('customer/contact', { pageTitle: 'Liên hệ đặt mẫu theo yêu cầu', })
    }
    notFound(req, res) {
        console.log('not found page?? - customer');
        res.render('not-found', { pageTitle: 'Không tìm thấy trang', layout: 'no-header-footer', });
    }
}

module.exports = new SiteController();
