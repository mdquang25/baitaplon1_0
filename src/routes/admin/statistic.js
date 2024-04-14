const express = require('express');
const router = express.Router();
const requireManagerLogin = require('../../public/middlewares/requireManagerLogin');
const statisticController = require('../../public/app/viewsController/admin/StatisticController');


router.get('/dem-don-hang', requireManagerLogin, statisticController.countOrders);
router.get('/', requireManagerLogin, statisticController.index);

module.exports = router;