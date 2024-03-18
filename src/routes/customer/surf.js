const express = require('express');
const router = express.Router();
const surfController = require('../../public/app/viewsController/customer/SurfController');
const userInterfaceObjects = require('../middleware/userInterfaceObjects.js');
const getCategories = require('../middleware/getCategories.js');

router.post('/loc', userInterfaceObjects, surfController.filter);
router.post('/tim-kiem', userInterfaceObjects, surfController.searchProductByPost);
router.get('/tim-kiem/chude/:slug', userInterfaceObjects, surfController.searchProductByCategory);
router.get('/tim-kiem', userInterfaceObjects, surfController.searchProductByAJAX);
router.get('/:slug/chitiet', userInterfaceObjects, getCategories, surfController.productDetails);
module.exports = router;
