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
                            res.render('customer/home', { pageTitle: 'Trang chủ', isLoggedin: req.session.isLoggedin, user: req.session.user, categories, products: multiMongooseToObjs(products), carousels: multiMongooseToObjs(carousels), cart: res.locals.cart, shopInfo: res.locals.shopInfo, });
                        }).catch(next);
                }).catch(next);
            }).catch(next);
    }

    login(req, res) {
        if (req.session.isLoggedin)
            res.redirect('/');
        else {
            res.render('customer/login', { pageTitle: 'Đăng nhập', layout: 'no-header', shopInfo: res.locals.shopInfo, });
        }
    }

    //[POST] /dangnhap
    checkLogin(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Handle validation errors, such as sending an error response
            return res.status(400).json({ errors: errors.array() });
        }
        Customer.findOne({ phoneNumber: req.body.phoneNumber })
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
                            cartId: customer.cartId,
                        };
                        req.session.isLoggedin = true;
                        res.redirect('/');
                    } else {
                        console.log('Invalid password');
                        res.render('customer/login', { pageTitle: 'Đăng nhập', layout: 'no-header', error: 'tài khoản hoặc mật khẩu không đúng!', preInput: req.body, shopInfo: res.locals.shopInfo, })
                    }
                });
            })
            .catch(next);
    }


    signUp(req, res) {
        if (req.session.isLoggedin)
            res.redirect('/');
        else
            res.render('customer/sign-up', { pageTitle: 'Đăng ký', layout: 'no-header', shopInfo: res.locals.shopInfo, })
    }

    //[POST] /dangky
    checkCreateAccount(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('validation error!');
            return res.status(400).json({ errors: errors.array() });
        }

        Customer.findOne({ phoneNumber: req.body.phoneNumber })
            .then(doc => {
                if (doc) {
                    res.render('customer/sign-up', { pageTitle: 'Đăng ký', layout: 'no-header', error: 'Tài khoản đã tồn tại!', shopInfo: res.locals.shopInfo, })
                }
                else if(isValidPhoneNumber(req.body.phoneNumber)){
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
                        });
                    });
                    res.redirect('/dangnhap');
                }
                else
                    res.render('customer/sign-up', { pageTitle: 'Đăng ký', layout: 'no-header', error: 'Số điện thoại không hợp lệ!', shopInfo: res.locals.shopInfo, })

        })
    }

    //[GET] /dangxuat
    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }

    notFound(req, res) {
        res.render('not-found', { pageTitle: 'Không tìm thấy trang', layout: 'no-header-footer', });
    }
}

module.exports = new SiteController();
