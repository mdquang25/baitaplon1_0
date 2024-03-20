const express = require('express');
const router = express.Router();
const customerMyAccountController = require('../../public/app/viewsController/customer/CustomerMyAccountController.js');
const requireLogin = require('../../public/middlewares/requireLogin');
const userInterfaceObjects = require('../../public/middlewares/userInterfaceObjects.js');
const getCategories = require('../../public/middlewares/getCategories.js');

router.patch('/sua', requireLogin, customerMyAccountController.saveModify);
router.patch('/doimatkhau', requireLogin, customerMyAccountController.saveChangePassword);
router.get('/doimatkhau', requireLogin, userInterfaceObjects, getCategories, customerMyAccountController.changePassword);
router.get('/sua', requireLogin, userInterfaceObjects, getCategories, customerMyAccountController.modify);
router.get('/xem', requireLogin, userInterfaceObjects, getCategories, customerMyAccountController.showInfo);


module.exports = router;