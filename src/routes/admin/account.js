const express = require('express');
const router = express.Router();
const adminMyAccountController = require('../../public/app/viewsController/admin/AdminMyAccountController');
const requireManagerLogin = require('../../public/middlewares/requireManagerLogin');

router.patch('/sua', requireManagerLogin, adminMyAccountController.saveModify);
router.patch('/doimatkhau', requireManagerLogin, adminMyAccountController.saveChangePassword);
router.get('/doimatkhau', requireManagerLogin, adminMyAccountController.changePassword);
router.get('/sua', requireManagerLogin, adminMyAccountController.modify);
router.get('/xem', requireManagerLogin, adminMyAccountController.showInfo);


module.exports = router;