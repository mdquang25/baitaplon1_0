const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const siteController = require('../../public/app/viewsController/customer/SiteController');
const userInterfaceObjects = require('../middleware/userInterfaceObjects.js');

router.get('/dangxuat', siteController.logout);
router.post('/dangnhap', [
    body('phoneNumber').notEmpty().withMessage('phoneNumber is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], siteController.checkLogin);
router.get('/dangnhap', siteController.login);
router.post('/dangky', [
    body('phoneNumber').notEmpty().withMessage('phoneNumber is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], siteController.checkCreateAccount);
router.get('/dangky', siteController.signUp);
router.get('/not-found-404', siteController.notFound);
router.get('/', userInterfaceObjects, siteController.index);

module.exports = router;
