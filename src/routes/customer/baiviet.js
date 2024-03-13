const express = require('express');
const router = express.Router();
const baivietController = require('../../public/app/viewsController/customer/BaivietController');


router.get('/:slug', baivietController.read);
router.get('/', baivietController.index);

module.exports = router;