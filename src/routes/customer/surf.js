const express = require('express');
const router = express.Router();
const surfController = require('../../public/app/viewsController/customer/SurfController');
const userInterfaceObjects = require('../../public/middlewares/userInterfaceObjects.js');
const getCategories = require('../../public/middlewares/getCategories.js');
const initSortable = require('../../public/middlewares/initSortable');


router.post('/loc', userInterfaceObjects, surfController.filter);
router.post('/tim-kiem', userInterfaceObjects, surfController.searchProductByPost);
router.get('/tim-kiem/chude/:slug', userInterfaceObjects, surfController.searchProductByCategory);
router.get('/tim-kiem', userInterfaceObjects, surfController.searchProductByAJAX);
router.get('/:slug/chitiet', userInterfaceObjects, getCategories, surfController.productDetails);
module.exports = router;
