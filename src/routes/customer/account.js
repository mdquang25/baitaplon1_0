const express = require('express');
const router = express.Router();
const customerAccountManagementController = require('../../public/app/viewsController/CustomerAccountManagementController.js');
const requireLogin = require('../middleware/requireLogin');


router.patch('/sua', requireLogin, customerAccountManagementController.saveModify);
router.patch('/doimatkhau', requireLogin, customerAccountManagementController.saveChangePassword);
router.get('/doimatkhau', requireLogin, customerAccountManagementController.changePassword);
router.get('/sua', requireLogin, customerAccountManagementController.modify);
router.get('/xem', requireLogin, customerAccountManagementController.showInfo);


module.exports = router;