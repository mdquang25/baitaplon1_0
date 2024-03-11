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
                    Cart.findById(doc.cart_id)
                        .then(cart => {
                            if (cart) {
                                cart.newOrderUpdate = true;
                                cart.save();
                            }
                        }).catch(()=> res.send({error: 'errors'}));
                    ProductQ.find({ _id: { $in: doc.productQ_ids } })
                        .then(docs => {
                            const productQs = multiMongooseToObjs(docs);
                            const order = mongooseToObj(doc);
                            order.productQs = productQs;
                            //res.send(order);
                            res.send({ ok: true });
                        }).catch(next
                            // (error) => {
                            // res.send({ error: 'error' });
                        //}
                        );
                }
                else {
                    res.send({ error: 'invaid id' });
                }
            }).catch((error)=> res.send({error: 'invaid id'}));
    }

}

module.exports = new OrdersController;