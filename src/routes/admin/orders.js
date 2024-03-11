const express = require('express');
const router = express.Router();
const requireManagerLogin = require('../middleware/requireManagerLogin');
const ordersController = require('../../public/app/viewsController/admin/OrdersController');


router.post('/capnhat', requireManagerLogin, ordersController.updateOrder);

router.get('/', requireManagerLogin, ordersController.index);
module.exports = router;