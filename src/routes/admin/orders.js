const express = require('express');
const router = express.Router();
const requireManagerLogin = require('../middleware/requireManagerLogin');
const ordersController = require('../../public/app/viewsController/admin/OrdersController');
const getShopInfo = require('../middleware/getShopInfo');


router.post('/capnhat', requireManagerLogin, ordersController.updateOrder);


router.get('/:id/in-don-hang', requireManagerLogin, getShopInfo, ordersController.printOrder);
router.get('/:id/chitiet', requireManagerLogin, ordersController.orderDetails);
router.get('/them', requireManagerLogin, ordersController.addOrder);
router.get('/', requireManagerLogin, ordersController.index);
module.exports = router;