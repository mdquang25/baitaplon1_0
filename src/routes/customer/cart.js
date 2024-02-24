const express = require('express');
const requiredLogin = require('../middleware/requireLogin');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../../public/app/viewsController/customer/CartController');
const requireLogin = require('../middleware/requireLogin');
const userInterfaceObjects = require('../middleware/userInterfaceObjects.js');

router.delete('/sanpham/xoa', requireLogin, cartController.removeProduct);
router.delete('/xoa-chon', requireLogin, cartController.deleteSelected);
router.get('/them/:slug', requiredLogin, cartController.addProduct);
router.get('/', requireLogin, userInterfaceObjects, cartController.products);

module.exports = router;
