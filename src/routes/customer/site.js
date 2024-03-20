const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const siteController = require('../../public/app/viewsController/customer/SiteController');
const userInterfaceObjects = require('../../public/middlewares/userInterfaceObjects.js');
const initSortable = require('../../public/middlewares/initSortable');


router.post('/dangnhap', userInterfaceObjects, [
    body('phoneNumber').notEmpty().withMessage('phoneNumber is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], siteController.checkLogin);
router.post('/dangky', [
    body('phoneNumber').notEmpty().withMessage('phoneNumber is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], siteController.checkCreateAccount);

router.get('/dangnhap', userInterfaceObjects, siteController.login);
router.get('/dangxuat', siteController.logout);
router.get('/dangky', userInterfaceObjects, siteController.signUp);
router.get('/lien-he', userInterfaceObjects, siteController.contactUs);
router.get('/not-found-404', siteController.notFound);
router.get('/', userInterfaceObjects, initSortable, siteController.index);

module.exports = router;
