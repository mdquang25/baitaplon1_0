const express = require('express');
const router = express.Router();
const customerMyAccountController = require('../../public/app/viewsController/customer/CustomerMyAccountController.js');
const requireLogin = require('../middleware/requireLogin');
const userInterfaceObjects = require('../middleware/userInterfaceObjects.js');

router.patch('/sua', requireLogin, customerMyAccountController.saveModify);
router.patch('/doimatkhau', requireLogin, customerMyAccountController.saveChangePassword);
router.get('/doimatkhau', requireLogin, userInterfaceObjects, customerMyAccountController.changePassword);
router.get('/sua', requireLogin, userInterfaceObjects, customerMyAccountController.modify);
router.get('/xem', requireLogin, userInterfaceObjects, customerMyAccountController.showInfo);


module.exports = router;