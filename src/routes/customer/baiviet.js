const express = require('express');
const router = express.Router();
const baivietController = require('../../public/app/viewsController/customer/BaivietController');
const userInterfaceObjects = require('../../public/middlewares/userInterfaceObjects.js');
const getCategories = require('../../public/middlewares/getCategories.js');
const initSortable = require('../../public/middlewares/initSortable');

router.get('/:id/viewed', baivietController.viewed);
router.get('/:slug', userInterfaceObjects, getCategories, baivietController.read);
router.get('/', userInterfaceObjects, getCategories, initSortable, baivietController.index);

module.exports = router;