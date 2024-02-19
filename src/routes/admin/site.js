const express = require('express');
const router = express.Router();
const adminSiteController = require('../../public/app/viewsController/admin/AdminSiteController');
const { body } = require('express-validator');
const requireManagerLogin = require('../middleware/requireManagerLogin');


router.post('/dangxuat', adminSiteController.logout);
router.post('/dangnhap', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], adminSiteController.checkLogin);
router.get('/dangnhap', adminSiteController.login);
router.get('/', requireManagerLogin, adminSiteController.index);

module.exports = router;
