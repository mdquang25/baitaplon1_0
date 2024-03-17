const Customer = require('../../models/Customer');
const Cart = require('../../models/Cart');
const ProductQ = require('../../models/ProductQ');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const { multiMongooseToObjs, mongooseToObj } = require('../../../../util/mongoose');
const { qrContent } = require('../../../../util/qrCode');
const { generateQRCode } = require('../../../../util/qrCodeImage');
class CartController {
    //[POST] /giohang/them
    addProduct(req, res, next) {
        console.log('add to cart - customer');
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                ProductQ.findOne({ cartId: cart._id, productId: req.query.productId })
                    .then(doc => {
                        if (doc) {
                            doc.quantity++;
                            (() => new Promise((resolve, reject) => {
                                doc.save();
                                resolve();
                            }))().then(() => {
                                res.send({ message: 'exist' });
                            });
                        }
                        else {
                            Product.exists({ _id: req.query.productId })
                                .then(exist => {
                                    if (exist) {
                                        const productQ = new ProductQ({
                                            cartId: cart._id,
                                            productId: req.query.productId,
                                            quantity: 1,
                                        });
                                        productQ.save();
                                        cart.newProduct = true;
                                        cart.productQ_ids.push(productQ._id);
                                        cart.save();
                                        res.send({ message: 'added' });
                                    }
                                    else
                                        res.send({ message: 'error' });
                                }).catch(() => {
                                    res.send({ message: 'error' });
                                });
                        }
                    }).catch(() => {
                        res.send({ message: 'error' });
                    });
            })
    }
    //[GET] /giohang
    products(req, res, next) {
        console.log('cart products - customer');
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                ProductQ.find({ _id: { $in: cart.productQ_ids } })
                    .then(docs => {
                        var productQPromises;
                        var productQs;
                        if (docs) {
                            productQs = multiMongooseToObjs(docs);
                            productQPromises = productQs.map(productQ => {
                                return Product.findById(productQ.productId)
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
                        res.render('customer/cart/cart-products', { pageTitle: 'Giỏ hàng', isLoggedin: req.session.isLoggedin, productQs, cart: {} });
                    });
            });
    }

    //[DELETE] /giohang/xoa-chon
    deleteSelected(req, res, next) {
        console.log('delete selected products - customer');
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                cart.productQ_ids = cart.productQ_ids.filter((element) => !req.body.productQ_ids.includes(element));
                cart.save();
                ProductQ.deleteMany({ _id: { $in: req.body.productQ_ids } })
                    .then(() => {
                        res.redirect('back');
                    }).catch(next);
            }).catch(next);
    }
    //[POST] /giohang/dat-hang
    placeOrder(req, res, next) {
        console.log('place order - customer');
        Promise.all([Cart.findById(req.session.user.cartId), Customer.findById(req.session.user.id)])
            .then(([cart, doc2]) => {
                const user = {
                    fullName: doc2.fullName,
                    phoneNumber: doc2.phoneNumber,
                    address: doc2.address,
                }
                ProductQ.find({ _id: { $in: cart.productQ_ids } })
                    .then(docs => {
                        docs.forEach(productQ => {
                            productQ.quantity = req.body[productQ._id + 'quantity1'];
                            productQ.save();
                        });
                        const items = docs.filter(doc => req.body.productQ_ids.includes(doc._id.toString()));
                        const productQs = multiMongooseToObjs(items);
                        const promises = productQs.map(productQ => {
                            return Product.findById(productQ.productId)
                                .then(product => {
                                    productQ.product = mongooseToObj(product);
                                    return productQ;
                                });
                        });
                        Promise.all(promises).then(productQs => {
                            var total = 0;
                            productQs.forEach(productQ => {
                                total += parseInt(productQ.quantity) * parseInt(productQ.product.price);
                            });
                            res.render('customer/cart/place-order', { pageTitle: 'Đặt hàng', isLoggedin: req.session.isLoggedin, productQs, total, user, cart: {} });
                        })
                    });
            });
    }

    //[POST] /giohang/dat-hang/luu-don-hang
    saveOrder(req, res, next) {
        console.log('save order - customer');
        const order = new Order(req.body);
        order.cart_id = req.session.user.cartId;
        order.orderName = req.session.user.fullName;
        order.orderPhoneNumber = req.session.user.phoneNumber;
        order.customer_id = req.session.user.id;
        if (req.body.ship === 'true') {
            order.shippingFee = res.locals.shopInfo.shippingFee;
            order.total = parseInt(req.body.productFee) + parseInt(res.locals.shopInfo.shippingFee);
        }
        else
            order.total = req.body.productFee;
        order.status = 0;
        order.paid = false;
        order.save();
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                order.cart_id = cart._id;
                if (req.body.cod === 'true')
                    cart.newOrderUpdate = true;
                cart.order_ids.push(order._id);
                cart.productQ_ids = cart.productQ_ids.filter((element) => {
                    const elementId = element.toString();
                    return !req.body.productQ_ids.includes(elementId);
                });
                cart.save();
                ProductQ.updateMany({ _id: { $in: req.body.productQ_ids } }, { $unset: { cartId: 1 } })
                    .then(() => {
                        ProductQ.find({ _id: { $in: req.body.productQ_ids } })
                            .then(docs => {
                                const productQs = docs.map(productQ => {
                                    return Product.findById(productQ.productId)
                                        .then(product => {
                                            productQ.imageUrl = product.imagesUrls[product.mainImageIndex];
                                            productQ.productSlug = product.slug;
                                            productQ.productName = product.name;
                                            productQ.price = product.price;
                                            productQ.total = product.price * productQ.quantity;
                                            productQ.save();
                                            product.stock -= productQ.quantity;
                                            product.save();
                                            return productQ;
                                        });
                                });
                                return Promise.all(productQs);
                            }).then(productQs => {
                                const bankingMessage = req.session.user.phoneNumber + ' - ' + order._id.toString();
                                order.bankingMessage = bankingMessage;
                                const code = qrContent(order.total.toString(), bankingMessage);
                                generateQRCode(code, order._id.toString() + '-qrcode.png')
                                    .then(path => {
                                        order.qrcodeUrl = path;
                                        order.save();
                                        if (req.body.cod === 'true') {
                                            res.redirect('/giohang/don-mua');
                                        }
                                        else {
                                            res.redirect('/giohang/don-mua/' + order._id.toString() + '/qr-thanh-toan');
                                        }
                                    });
                            })

                    });
            });
    }

    //[GET] /giohang/don-mua/:id/qr-thanh-toan
    showQRCode(req, res, next) {
        Order.findById(req.params.id)
            .then(order => {
                res.render('customer/cart/show-qrcode', { pageTitle: 'Quét mã QR thanh toán', order: mongooseToObj(order), user: req.session.user, isLoggedin: req.session.isLoggedin, cart: res.locals.cart, shopInfo: res.locals.shopInfo, });
            }).catch(next);
    }
    //[DELETE] /giohang/sanpham/xoa
    removeProduct(req, res, next) {
        console.log('remove one product - customer');
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                const index = cart.productQ_ids.indexOf(req.body.deleteId);
                if (index > -1) {
                    cart.productQ_ids.splice(index, 1);
                }
                cart.save();
                ProductQ.findByIdAndDelete(req.body.deleteId)
                    .then(() => {
                        res.redirect('back');
                    }).catch(next);
            }).catch(next);
    }

    //[GET] /giohang/don-mua
    orders(req, res, next) {
        console.log('cart orders - customer');
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                Order.find({ _id: { $in: cart.order_ids } })
                    .then(docs => {
                        const items = multiMongooseToObjs(docs);
                        const orders = items.map(order => {
                            return ProductQ.find({ _id: { $in: order.productQ_ids } })
                                .then(docs => {
                                    order.productQs = multiMongooseToObjs(docs);
                                    return order;
                                });
                        });
                        return Promise.all(orders);
                    }).then(items => {
                        const orders0 = items.filter(order => order.status === 0);
                        const orders1 = items.filter(order => order.status === 1);
                        const orders2 = items.filter(order => order.status === 2);
                        const orders3 = items.filter(order => order.status === 3);
                        const orders4 = items.filter(order => order.status === 4);
                        const orders = {
                            orders0, orders1, orders2, orders3, orders4,
                        }
                        cart.newOrderUpdate = false;
                        cart.save();
                        res.render('customer/cart/cart-orders', { pageTitle: 'Đơn mua', isLoggedin: req.session.isLoggedin, orders, cart: {}, shopInfo: res.locals.shopInfo, })
                    })
            });
    }
}

module.exports = new CartController();
