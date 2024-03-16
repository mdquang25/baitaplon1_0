const express = require('express');
const router = express.Router();
const baivietController = require('../../public/app/viewsController/customer/BaivietController');
const userInterfaceObjects = require('../middleware/userInterfaceObjects.js');


router.get('/:slug', userInterfaceObjects, baivietController.read);
router.get('/', userInterfaceObjects, baivietController.index);

module.exports = router;