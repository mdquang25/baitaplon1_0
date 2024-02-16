const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../../public/app/viewsController/ProductController');

router.get('/:slug/chitiet', productController.productDetails);
module.exports = router;
