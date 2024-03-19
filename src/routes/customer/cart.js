const express = require('express');
const requiredLogin = require('../middleware/requireLogin');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../../public/app/viewsController/customer/CartController');
const requireLogin = require('../middleware/requireLogin');
const userInterfaceObjects = require('../middleware/userInterfaceObjects.js');
const getShopInfo = require('../middleware/getShopInfo.js');
const getCategories = require('../middleware/getCategories.js');

router.delete('/sanpham/xoa', requireLogin, cartController.removeProduct);
router.delete('/xoa-chon', requireLogin, cartController.deleteSelected);
router.post('/dat-hang/luu-don-hang', requireLogin,getShopInfo, cartController.saveOrder);
router.post('/dat-hang', requireLogin, userInterfaceObjects, getCategories, cartController.placeOrder);
router.get('/them', requiredLogin, cartController.addProduct);
router.get('/update-productq-quantity', requireLogin, cartController.updateProductQQuantity);
router.get('/don-mua/:id/qr-thanh-toan', requireLogin, userInterfaceObjects, getCategories, cartController.showQRCode);
router.get('/don-mua', requireLogin, userInterfaceObjects, getCategories, cartController.orders);
router.get('/', requireLogin, userInterfaceObjects, getCategories, cartController.products);

module.exports = router;
