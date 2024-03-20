const express = require('express');
const router = express.Router();
const shopInfoController = require('../../public/app/viewsController/admin/ShopInfoController');
const uploader = require('../../public/middlewares/uploader');
const requireManagerLogin = require('../../public/middlewares/requireManagerLogin');

router.post('/quangcao/luu', requireManagerLogin,uploader.single('image'), shopInfoController.saveCarousel);
router.put('/thongtin/luu', requireManagerLogin, shopInfoController.saveInfo);
router.post('/quangcao/:id/luu', uploader.single('image'), requireManagerLogin, shopInfoController.saveModifyCarousel);

router.get('/quangcao/:id/sua', requireManagerLogin, shopInfoController.modifyCarousel);
router.get('/quangcao/them', requireManagerLogin, shopInfoController.addCarousel);
router.get('/quangcao', requireManagerLogin, shopInfoController.carousels);
router.get('/thongtin', requireManagerLogin, shopInfoController.info);
router.get('/', requireManagerLogin, shopInfoController.index);
module.exports = router;