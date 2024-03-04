const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const surfController = require('../../public/app/viewsController/customer/SurfController');
const userInterfaceObjects = require('../middleware/userInterfaceObjects.js');

router.post('/tim-kiem', userInterfaceObjects, surfController.searchProductByPost);
router.get('/tim-kiem', userInterfaceObjects, surfController.searchProductByAJAX);
router.get('/:slug/chitiet', userInterfaceObjects, surfController.productDetails);
module.exports = router;
