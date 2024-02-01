const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const siteController = require('../../public/app/viewsController/SiteController');


router.post('/dangxuat', siteController.logout);
router.post('/dangnhap', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], siteController.checkLogin);
router.get('/dangnhap', siteController.login);
router.post('/dangky', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], siteController.checkCreateAccount);
router.get('/dangky', siteController.signUp);
router.get('/not-found-404', siteController.notFound);
router.get('/', siteController.index);

module.exports = router;
