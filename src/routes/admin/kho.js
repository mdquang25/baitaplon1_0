const express = require('express');
const router = express.Router();
const productManagementController = require('../../public/app/viewsController/ProductManagementController');
const uploader = require('../middleware/uploader');
const requireAdminLogin = require('../middleware/requireAdminLogin');
const requireManagerLogin = require('../middleware/requireManagerLogin');



router.post('/chude/:slug/them-phanloai/luu', requireManagerLogin, uploader.single('icon'), productManagementController.saveType);
router.delete('/phanloai/xoa', requireManagerLogin, productManagementController.deleteType);
router.post('/chude/:slug/phanloai/:typeslug/sua', requireManagerLogin, uploader.single('icon'), productManagementController.saveModifiedType);
router.post('/chude/luu', requireManagerLogin, productManagementController.saveCategory);
router.delete('/chude/xoa', requireManagerLogin, productManagementController.deleteCategory);
router.patch('/chude/:slug/sua', requireManagerLogin, productManagementController.saveModifiedCategory);

router.post('/sanpham/them', requireManagerLogin, uploader.array('images', 10), productManagementController.saveProduct);
router.post('/sanpham/:slug/sua', requireManagerLogin, uploader.array('images', 10), productManagementController.saveModifiedProduct);
router.patch('/sanpham/xoa', requireManagerLogin, productManagementController.deleteProduct);


router.get('/chude/:slug/phanloai/:typeslug/sua', requireManagerLogin, productManagementController.modifyType);
router.get('/chude/:slug/them-phanloai', requireManagerLogin, productManagementController.addType);
router.get('/chude/:slug/sua', requireManagerLogin, productManagementController.modifyCategory);
router.get('/chude/them', requireManagerLogin, productManagementController.addCategory);
router.get('/chude-phanloai', requireManagerLogin, productManagementController.typeManagement);
router.get('/chude/:slug', requireManagerLogin, productManagementController.categoryDetails);

router.get('/sanpham/:slug/sua', requireManagerLogin, productManagementController.modifyProduct);
router.get('/sanpham/them', requireManagerLogin, productManagementController.addProduct);
router.get('/sanpham/:slug', requireManagerLogin, productManagementController.productDetails);
router.get('/sanpham', requireManagerLogin, productManagementController.productManagement);
router.get('/', requireManagerLogin, productManagementController.productManagement);


module.exports = router;