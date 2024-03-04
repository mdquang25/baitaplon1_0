const express = require('express');
const router = express.Router();
const requireManagerLogin = require('../middleware/requireManagerLogin');
const customersController = require('../../public/app/viewsController/admin/CustomersController');


router.get('/:id/don-mua', requireManagerLogin, customersController.orders);
router.get('/timkiem', requireManagerLogin, customersController.search);
router.get('/', requireManagerLogin, customersController.index);

module.exports = router;