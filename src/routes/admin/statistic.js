const express = require('express');
const router = express.Router();
const requireManagerLogin = require('../middleware/requireManagerLogin');
const statisticController = require('../../public/app/viewsController/admin/StatisticController');


router.get('/dem-don-hang-tuan', requireManagerLogin, statisticController.countOrdersOfWeek);
router.get('/', requireManagerLogin, statisticController.index);

module.exports = router;