const express = require('express');
const router = express.Router();
const productController = require('../../public/app/viewsController/admin/ProductController');
const categoryController = require('../../public/app/viewsController/admin/CategoryController');
const typeController = require('../../public/app/viewsController/admin/TypeController');
const uploader = require('../middleware/uploader');
const requireManagerLogin = require('../middleware/requireManagerLogin');



router.post('/chude/luu', requireManagerLogin, categoryController.saveCategory);
router.patch('/chude/:slug/sua', requireManagerLogin, categoryController.saveModifiedCategory);
router.delete('/chude/xoa', requireManagerLogin, categoryController.deleteCategory);

router.get('/chude-phanloai', requireManagerLogin, categoryController.index);
router.get('/chude/them', requireManagerLogin, categoryController.addCategory);
router.get('/chude/:slug/sua', requireManagerLogin, categoryController.modifyCategory);
router.get('/chude/:slug', requireManagerLogin, categoryController.categoryDetails);


router.post('/chude/:slug/them-phanloai/luu', requireManagerLogin, uploader.single('icon'), typeController.saveType);
router.post('/chude/:slug/phanloai/:typeslug/sua', requireManagerLogin, uploader.single('icon'), typeController.saveModifiedType);
router.delete('/phanloai/xoa', requireManagerLogin, typeController.deleteType);

router.get('/chude/:slug/phanloai/:typeslug/sua', requireManagerLogin, typeController.modifyType);
router.get('/chude/:slug/them-phanloai', requireManagerLogin, typeController.addType);

router.post('/sanpham/them', requireManagerLogin, uploader.array('images', 10), productController.saveProduct);
router.post('/sanpham/:slug/sua', requireManagerLogin, uploader.array('images', 10), productController.saveModifiedProduct);
router.patch('/sanpham/xoa', requireManagerLogin, productController.deleteProduct);

router.get('/sanpham/:slug/sua', requireManagerLogin, productController.modifyProduct);
router.get('/sanpham/them', requireManagerLogin, productController.addProduct);
router.get('/sanpham/:slug', requireManagerLogin, productController.productDetails);
router.get('/sanpham', requireManagerLogin, productController.productManagement);
router.get('/', requireManagerLogin, productController.productManagement);


module.exports = router;