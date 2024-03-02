const express = require('express');
const router = express.Router();
const shopInfoController = require('../../public/app/viewsController/admin/ShopInfoController');
const uploader = require('../middleware/uploader');
const requireManagerLogin = require('../middleware/requireManagerLogin');

router.post('/quangcao/luu', requireManagerLogin,uploader.single('image'), shopInfoController.saveCarousel);
router.put('/thongtin/luu', requireManagerLogin, shopInfoController.saveInfo);

router.get('/quangcao/:slug/sua', requireManagerLogin, shopInfoController.carousels);
router.get('/quangcao/them', requireManagerLogin, shopInfoController.addCarousel);
router.get('/quangcao', requireManagerLogin, shopInfoController.carousels);
router.get('/thongtin', requireManagerLogin, shopInfoController.info);
router.get('/', requireManagerLogin, shopInfoController.index);
module.exports = router;