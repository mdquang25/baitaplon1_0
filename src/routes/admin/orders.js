const express = require('express');
const router = express.Router();
const requireManagerLogin = require('../../public/middlewares/requireManagerLogin');
const ordersController = require('../../public/app/viewsController/admin/OrdersController');
const getShopInfo = require('../../public/middlewares/getShopInfo');
const initSortable = require('../../public/middlewares/initSortable');


router.post('/luu-don-hang', requireManagerLogin, getShopInfo, ordersController.saveNewOrder);
router.post('/capnhat', requireManagerLogin, ordersController.updateOrder);


router.get('/:id/qr-thanh-toan', requireManagerLogin, getShopInfo, ordersController.showQR);
router.get('/:id/in-don-hang', requireManagerLogin, getShopInfo, ordersController.printOrder);
router.get('/:id/chitiet', requireManagerLogin, ordersController.orderDetails);
router.get('/don-hoan-thanh', requireManagerLogin, ordersController.doneOrders);
router.get('/timkiem', requireManagerLogin, ordersController.search);
router.get('/them', requireManagerLogin, getShopInfo, ordersController.addOrder);
router.get('/', requireManagerLogin, initSortable, ordersController.index);
module.exports = router;