const express = require('express');
const requiredLogin = require('../middleware/requireLogin');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../../public/app/viewsController/customer/CartController');
const requireLogin = require('../middleware/requireLogin');
const userInterfaceObjects = require('../middleware/userInterfaceObjects.js');

router.delete('/sanpham/xoa', requireLogin, cartController.removeProduct);
router.delete('/xoa-chon', requireLogin, cartController.deleteSelected);
router.post('/dat-hang/luu-don-hang', requireLogin, userInterfaceObjects, cartController.saveOrder);
router.post('/dat-hang', requireLogin, userInterfaceObjects, cartController.placeOrder);
router.post('/them', requiredLogin, cartController.addProduct);
router.get('/don-mua/:id/qr-thanh-toan', requireLogin, userInterfaceObjects, cartController.showQRCode);
router.get('/don-mua', requireLogin, userInterfaceObjects, cartController.orders);
router.get('/', requireLogin, userInterfaceObjects, cartController.products);

module.exports = router;
