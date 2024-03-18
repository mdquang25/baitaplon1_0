const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const ProductQ = require('../../models/ProductQ');
const Product = require('../../models/Product');
const Customer = require('../../models/Customer');
const { mongooseToObj, multiMongooseToObjs } = require('../../../../util/mongoose');
const { qrContent } = require('../../../../util/qrCode');
const { generateQRCode } = require('../../../../util/qrCodeImage');

class OrdersController {
    index(req, res, next) {
        console.log('orders - admin');
        const printId = req.query.printId;
        Order.find({ status: { $ne: 4 } })
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
                const orders = {
                    orders0, orders1, orders2, orders3,
                }
                res.render('admin/orders/orders', { pageTitle: 'Đơn hàng', layout: 'admin', isAdmin: req.session.isAdmin, orders, printId });
            });
    }

    updateOrder(req, res, next) {
        console.log('update order - admin');
        if (!req.body.paid && !req.body.confirm)
            res.send({ error: 'no messange' });
        else
            Order.findOne({ _id: req.body.orderId })
                .then(doc => {
                    if (doc) {
                        if (req.body.paid) {
                            doc.paid = true;
                            if (doc.status === 3)
                                doc.status = 4;
                        }
                        if (req.body.confirm) {
                            if (doc.status < 2) {
                                doc.status++;
                            }
                            else if (doc.status === 2) {
                                if (doc.paid) {
                                    doc.status = 4;
                                }
                                else
                                    doc.status = 3;
                            }
                        }
                        doc.save();
                        if (doc.cart_id)
                            Cart.findById(doc.cart_id)
                                .then(cart => {
                                    if (cart) {
                                        cart.newOrderUpdate = true;
                                        cart.save();
                                    }
                                }).catch(next);
                        if (doc.status === 4) {
                            ProductQ.find({ _id: { $in: doc.productQ_ids } })
                                .then(docs => {
                                    if (docs) {
                                        docs.forEach(doc => {
                                            Product.findById(doc.productId)
                                                .then(product => {
                                                    if (product) {
                                                        if (product.sold)
                                                            product.sold += doc.quantity;
                                                        else
                                                            product.sold = doc.quantity;
                                                        product.save();
                                                    }
                                                })
                                        })
                                    }
                                }).catch((error) => {
                                    res.send({ error: 'error' });
                                });
                        }
                        res.send({ ok: 'true' });
                    }
                    else {
                        res.send({ error: 'invaid id' });
                    }
                }).catch((error) => res.send({ error: 'invaid id' }));
    }

    doneOrders(req, res, next) {
        Order.find({ status: 4 })
            .then(orders => {
            res.render('admin/orders/done-orders', {pageTitle: 'Đơn đã hoàn thành', layout: 'admin', isAdmin: req.session.isAdmin, orders: multiMongooseToObjs(orders), })
        })
    }

    addOrder(req, res, next) {
        res.render('admin/orders/add-order', { pageTitle: 'Tạo đơn hàng', layout: 'admin', isAdmin: req.session.isAdmin, manager: req.session.manager, });
    }

    saveNewOrder(req, res, next) {
        console.log('save new order - admin');
        console.log('body: ', req.body);
        const order = new Order(req.body);
        order.orderName = req.session.manager.fullName;
        order.orderPhoneNumber = req.session.manager.phoneNumber;
        if (req.body.ship === 'true') {
            order.shippingFee = res.locals.shopInfo.shippingFee;
            order.total = parseInt(req.body.productFee) + parseInt(res.locals.shopInfo.shippingFee);
        }
        else {
            order.shippingFee = 0;
            order.total = req.body.productFee;
        }
        order.status = 1;
        order.paid = false;
        Customer.findOne({ phoneNumber: req.body.phoneNumber })
            .then(customer => {
                if (customer) {
                    Cart.findById(customer.cartId)
                        .then(cart => {
                            if (cart) {
                                order.cart_id = cart._id;
                                order.customer_id = customer._id;
                                cart.order_ids.push(order._id);
                                cart.newOrderUpdate = true;
                                cart.save();
                            }
                        })
                }
            });
        const productQ_ids = req.body.productIds.map(productId => {
            const quantity = parseInt(req.body[productId + 'quantity']);
            return Product.findById(productId)
                .then(product => {
                    const productQ = new ProductQ({
                        productId,
                        quantity,
                        productName: product.name,
                        imageUrl: product.imagesUrls[product.mainImageIndex],
                        productSlug: product.slug,
                        price: product.price,
                        total: product.price * quantity,
                    });
                    product.stock -= quantity;
                    product.save();
                    productQ.save();
                    return productQ._id.toString();
                });
        });
        Promise.all(productQ_ids)
            .then(ids => {
                order.productQ_ids = ids;
                console.log('productQ_ids: ', ids);
                const bankingMessage = req.body.phoneNumber + ' - ' + order._id.toString();
                order.bankingMessage = bankingMessage;
                const code = qrContent(order.total.toString(), bankingMessage);
                generateQRCode(code, order._id.toString() + '-qrcode.png')
                    .then(path => {
                        order.qrcodeUrl = path;
                        order.save();
                        if (req.body.cod === 'true') {
                            if (req.body.print === 'true')
                                res.redirect('/admin/donhang?printId=' + order._id);
                            else
                                res.redirect('/admin/donhang');
                        }
                        else {
                            if (req.body.print === 'true')
                                res.redirect('/admin/donhang/' + order._id.toString() + '/qr-thanh-toan?printId=' + order._id);
                            else
                                res.redirect('/admin/donhang/' + order._id.toString() + '/qr-thanh-toan');
                        }
                    });
            });
    }

    //[GET] /admin/donhang/:id/chitiet
    orderDetails(req, res, next) {
        Order.findOne({ _id: req.params.id })
            .then(doc => {
                if (doc) {
                    const order = mongooseToObj(doc);
                    ProductQ.find({ _id: { $in: doc.productQ_ids } })
                        .then(docs => {
                            order.productQs = multiMongooseToObjs(docs);
                            res.render('admin/orders/order-details', { pageTitle: 'Chi tiết đơn hàng', layout: 'admin', isAdmin: req.session.isAdmin, order, });
                        }).catch(next);
                }
                else {
                    res.redirect('/not-found-404');
                }
            }).catch(() => res.redirect('/not-found-404'));
    }

    //[GET] /admin/donhang/:id/in-don-hang
    printOrder(req, res, next) {
        Order.findOne({ _id: req.params.id })
            .then(doc => {
                if (doc) {
                    const order = mongooseToObj(doc);
                    ProductQ.find({ _id: { $in: doc.productQ_ids } })
                        .then(docs => {
                            order.productQs = multiMongooseToObjs(docs);
                            res.render('admin/orders/order-details-print', { pageTitle: 'In đơn hàng', layout: 'print', order, });
                        }).catch(next);
                }
                else {
                    res.redirect('/not-found-404');
                }
            }).catch(() => res.redirect('/not-found-404'));
    }

    showQR(req, res, next) {
        const printId = req.query.printId;
        Order.findById(req.params.id)
            .then(order => {
                res.render('admin/orders/show-qrcode', { pageTitle: 'Mã QR thanh toán', layout: 'admin', order: mongooseToObj(order), isAdmin: req.session.isAdmin, printId, });
            }).catch(() => res.render('/not-found-404'));
    }

    search(req, res, next) {
        Order.exists({ _id: req.query.id })
            .then(exist => {
                if (exist) {
                    res.send({ id: req.query.id });
                }
                else {
                    res.send({ error: true });
                }
            }).catch(() => res.send({ error: true }));
    }
}

module.exports = new OrdersController;