const Customer = require('../../models/Customer');
const Cart = require('../../models/Cart');
const Order = require('../../models/Order');
const ProductQ = require('../../models/ProductQ');
const { mongooseToObj, multiMongooseToObjs } = require('../../../../util/mongoose');


class CustomersController{
    index(req, res, next) {
        Promise.all([Customer.countDocuments(), Customer.find().limit(25)])
            .then(([count, customers]) => {
                res.render('admin/customers/list', { pageTitle: 'Khách hàng', layout: 'admin',count, customers: multiMongooseToObjs(customers),});
            }).catch(next);
    }

    search(req, res, next) {
        Customer.findOne({ phoneNumber: req.body.phoneNumber })
            .then(doc => {
                if (doc)
                    res.render('admin/customers/searchResult', { pageTitle: 'Tìm kiếm khách hàng', layout: 'admin', keyword: req.body.phoneNumber, customer: mongooseToObj(doc),});
                else
                    res.render('admin/customers/searchFailed', { pageTitle: 'Tìm kiếm khách hàng', layout: 'admin', keyword: req.body.phoneNumber, });
            }).catch(() =>
                res.render('admin/customers/searchFailed', { pageTitle: 'Tìm kiếm khách hàng', layout: 'admin', keyword: req.body.phoneNumber, })
        );
    }

    //[GET] /admin/khachhang/:id/don-mua
    orders(req, res, next) {
        console.log('customer orders - admin');
        Customer.findById(req.params.id)
            .then(doc => {
                if (doc) {
                    const customer = {
                        id: doc._id,
                        fullName: doc.fullName,
                        phoneNumber: doc.phoneNumber,
                    }
                    Cart.findById(doc.cartId)
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
                                    res.render('admin/orders/orders', { pageTitle: 'Đơn mua của khách hàng', layout: 'admin', orders,customer, })
                                })
                        });
                }
                else{
                    res.redirect('back');
                }
            }).catch(() => res.redirect('back'));
    }
}

module.exports = new CustomersController;