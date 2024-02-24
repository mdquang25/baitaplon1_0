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
                            ( ()=> new Promise((resolve, reject)=>{
                                doc.save();
                                resolve();
                            }))().then(() => {
                                res.redirect('back');
                            });
                        }
                        else {
                            const productQ = new ProductQ({
                                cartId: cart._id,
                                productSlug: req.params.slug,
                                quantity: 1,
                            });
                            cart.newProduct = true;
                            Promise.all([productQ.save(), cart.save()]).then(() => {
                                res.redirect('back');
                            });
                        }
                    })
            })
    }
    //[GET] /giohang
    products(req, res, next) {
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                ProductQ.find({ cartId: cart._id })
                    .then(docs => {
                        var productQPromises;
                        var productQs;
                        if (docs) {
                            productQs = multiMongooseToObjs(docs);
                            productQPromises = productQs.map(productQ => {
                                return Product.findOne({ slug: productQ.productSlug })
                                    .then(product => {
                                        productQ.product = mongooseToObj(product);
                                        return productQ;
                                    });
                            });
                        }
                        return Promise.all(productQPromises);
                    }).then(productQs => {
                        cart.newProduct = false;
                        cart.save();
                        res.render('customer/cart/cart-products', { pageTitle: 'Giỏ hàng', isLoggedin: req.session.isLoggedin, productQs, shopInfo: res.locals.shopInfo, })
                    });
            });
    }

    //[DELETE] /giohang/xoa-chon
    deleteSelected(req, res, next) {
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                cart.productQ_id = cart.productQ_id.filter((element) => !req.body.productQ_ids.includes(element));
                cart.save();
                ProductQ.deleteMany({ _id: { $in: req.body.productQ_ids } })
                    .then(() => {
                        res.redirect('back');
                    }).catch(next);
            }).catch(next);
    }

    //[DELETE] /giohang/sanpham/xoa
    removeProduct(req, res, next) {
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                const index = cart.productQ_id.indexOf(req.body.deleteId);
                if (index > -1) {
                    cart.productQ_id.splice(index, 1);
                }
                cart.save();
                ProductQ.findByIdAndDelete(req.body.deleteId)
                    .then(() => {
                        res.redirect('back');
                    }).catch(next);
            }).catch(next);
    }
}

module.exports = new CartController();
