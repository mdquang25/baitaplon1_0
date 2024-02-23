const express = require('express');
const requiredLogin = require('../middleware/requireLogin');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../../public/app/viewsController/customer/CartController');
const requireLogin = require('../middleware/requireLogin');

router.delete('/xoa-chon', requireLogin, cartController.deleteSelected);
router.get('/them/:slug', requiredLogin, cartController.addProduct);
router.get('/', requireLogin, cartController.products);

module.exports = router;
