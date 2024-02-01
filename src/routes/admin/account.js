const express = require('express');
const router = express.Router();
const adminAccountManagementController = require('../../public/app/viewsController/AdminAccountManagementController');
const requireAdminLogin = require('../middleware/requireAdminLogin');
const requireManagerLogin = require('../middleware/requireManagerLogin');


router.patch('/sua', requireManagerLogin, adminAccountManagementController.saveModify);
router.patch('/doimatkhau', requireManagerLogin, adminAccountManagementController.saveChangePassword);
router.get('/doimatkhau', requireManagerLogin, adminAccountManagementController.changePassword);
router.get('/sua', requireManagerLogin, adminAccountManagementController.modify);
router.get('/xem', requireManagerLogin, adminAccountManagementController.showInfo);


module.exports = router;