const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const ProductQ = require('../../models/ProductQ');
const { mongooseToObj, multiMongooseToObjs } = require('../../../../util/mongoose');


class OrdersController {
    index(req, res, next) {
        console.log('orders - admin');
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
                res.render('admin/orders/orders', { pageTitle: 'Đơn hàng', layout: 'admin', isAdmin: req.session.isAdmin, orders, });
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
                        if (doc.cart_idd)
                            Cart.findById(doc.cart_id)
                                .then(cart => {
                                    if (cart) {
                                        cart.newOrderUpdate = true;
                                        cart.save();
                                    }
                                }).catch(next);
                        // ProductQ.find({ _id: { $in: doc.productQ_ids } })
                        //     .then(docs => {
                        //         const productQs = multiMongooseToObjs(docs);
                        //         const order = mongooseToObj(doc);
                        //         order.productQs = productQs;
                        //         res.send(order);
                        //         res.send({ ok: true });
                        //     }).catch((error) => {
                        //         res.send({ error: 'error' });
                        //     });
                        res.send({ ok: 'true' });
                    }
                    else {
                        res.send({ error: 'invaid id' });
                    }
                }).catch((error) => res.send({ error: 'invaid id' }));
    }

    addOrder(req, res, next) {

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
}

module.exports = new OrdersController;