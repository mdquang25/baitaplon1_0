const Customer = require('../../models/Customer');
const Cart = require('../../models/Cart');
const ProductQ = require('../../models/ProductQ');
const Category = require('../../models/ProductCategory');
const Type = require('../../models/ProductType');
const Product = require('../../models/Product');
const ShopInfo = require('../../models/ShopInfo');
const { multiMongooseToObjs, mongooseToObj } = require('../../../../util/mongoose')
const { validationResult } = require('express-validator');

class CartController {
    //[GET] /giohang/them/:slug
    addProduct(req, res, next) {
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                ProductQ.findOne({ cartId: cart._id, productSlug: req.params.slug })
                    .then(doc => {
                        if (doc) {
                            doc.quantity++;
                            doc.save();
                        }
                        else {
                            const productQ = new ProductQ({
                                cartId: cart._id,
                                productSlug: req.params.slug,
                                quantity: 1,
                            });
                            productQ.save();
                            cart.newProduct = true;
                            cart.save();
                        }
                    })
            })
        res.redirect('back');
    }
    //[GET] /giohang
    products(req, res, next) {
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                ProductQ.find({ cartId: cart._id})
                    .then(docs => {
                        var productQs;
                        if (docs) {
                            productQs = multiMongooseToObjs(docs);
                        }
                        cart.newProduct = false;
                        cart.save();
                        res.render('customer/cart/cart-products', {pageTitle: 'Giỏ hàng', isLoggedin: req.session.isLoggedin, productQs, shopInfo: res.locals.shopInfo, })
                    })
            })
    }
}

module.exports = new CartController();
