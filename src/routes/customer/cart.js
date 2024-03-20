const express = require('express');
const requiredLogin = require('../../public/middlewares/requireLogin');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../../public/app/viewsController/customer/CartController');
const requireLogin = require('../../public/middlewares/requireLogin');
const requireLoginAjax = require('../../public/middlewares/requireLoginAjax');
const userInterfaceObjects = require('../../public/middlewares/userInterfaceObjects.js');
const getShopInfo = require('../../public/middlewares/getShopInfo.js');
const getCategories = require('../../public/middlewares/getCategories.js');

router.delete('/sanpham/xoa', requireLoginAjax, cartController.removeProduct);
router.delete('/xoa-chon', requireLoginAjax, cartController.deleteSelected);
router.post('/dat-hang/luu-don-hang', requireLogin ,getShopInfo, cartController.saveOrder);
router.post('/dat-hang', requireLogin, userInterfaceObjects, getCategories, cartController.placeOrder);
router.get('/them', requireLoginAjax, cartController.addProduct);
router.get('/update-productq-quantity', requireLoginAjax, cartController.updateProductQQuantity);
router.get('/don-mua/:id/qr-thanh-toan', requireLogin, userInterfaceObjects, getCategories, cartController.showQRCode);
router.get('/don-mua', requireLogin, userInterfaceObjects, getCategories, cartController.orders);
router.get('/', requireLogin, userInterfaceObjects, getCategories, cartController.products);

module.exports = router;
