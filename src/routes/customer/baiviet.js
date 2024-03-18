const express = require('express');
const router = express.Router();
const baivietController = require('../../public/app/viewsController/customer/BaivietController');
const userInterfaceObjects = require('../middleware/userInterfaceObjects.js');
const getCategories = require('../middleware/getCategories.js');


router.get('/:slug', userInterfaceObjects, getCategories, baivietController.read);
router.get('/', userInterfaceObjects, getCategories, baivietController.index);

module.exports = router;