const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const surfController = require('../../public/app/viewsController/customer/SurfController');

router.get('/:slug/chitiet', surfController.productDetails);
module.exports = router;
