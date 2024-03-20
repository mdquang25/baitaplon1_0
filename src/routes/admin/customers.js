const express = require('express');
const router = express.Router();
const requireManagerLogin = require('../../public/middlewares/requireManagerLogin');
const customersController = require('../../public/app/viewsController/admin/CustomersController');
const initSortable = require('../../public/middlewares/initSortable');


router.get('/:id/don-mua', requireManagerLogin, customersController.orders);
router.get('/timkiem', requireManagerLogin, customersController.search);
router.get('/', requireManagerLogin, initSortable, customersController.index);

module.exports = router;