const express = require('express');
const router = express.Router();
const customerMyAccountController = require('../../public/app/viewsController/customer/CustomerMyAccountController.js');
const requireLogin = require('../middleware/requireLogin');


router.patch('/sua', requireLogin, customerMyAccountController.saveModify);
router.patch('/doimatkhau', requireLogin, customerMyAccountController.saveChangePassword);
router.get('/doimatkhau', requireLogin, customerMyAccountController.changePassword);
router.get('/sua', requireLogin, customerMyAccountController.modify);
router.get('/xem', requireLogin, customerMyAccountController.showInfo);


module.exports = router;