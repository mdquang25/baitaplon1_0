const express = require('express');
const requiredLogin = require('../middleware/requireLogin');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../../public/app/viewsController/CartController');

router.get('/them/:slug', requiredLogin, cartController.addProduct);
module.exports = router;
