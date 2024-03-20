const express = require('express');
const router = express.Router();
const productController = require('../../public/app/viewsController/admin/ProductController');
const categoryController = require('../../public/app/viewsController/admin/CategoryController');
const typeController = require('../../public/app/viewsController/admin/TypeController');
const importController = require('../../public/app/viewsController/admin/ImportController');
const uploader = require('../../public/middlewares/uploader');
const getShopInfo = require('../../public/middlewares/getShopInfo');
const requireManagerLogin = require('../../public/middlewares/requireManagerLogin');
const initSortable = require('../../public/middlewares/initSortable');


router.post('/nhaphang/luu-phieu-nhap', requireManagerLogin, importController.saveImport);

router.get('/nhaphang/tim-san-pham', requireManagerLogin, importController.findProduct);
router.get('/nhaphang/lichsu/:id/in-phieu', requireManagerLogin, getShopInfo, importController.printImportBill);
router.get('/nhaphang/lichsu/:id', requireManagerLogin, importController.importDetails);
router.get('/nhaphang/lichsu', requireManagerLogin, initSortable, importController.history);
router.get('/nhaphang', requireManagerLogin, importController.import);

router.post('/chude/luu', requireManagerLogin, categoryController.saveCategory);
router.patch('/chude/:slug/sua', requireManagerLogin, categoryController.saveModifiedCategory);
router.delete('/chude/xoa', requireManagerLogin, categoryController.deleteCategory);

router.get('/chude-phanloai', requireManagerLogin, initSortable, categoryController.index);
router.get('/chude/them', requireManagerLogin, categoryController.addCategory);
router.get('/chude/:slug/sua', requireManagerLogin, categoryController.modifyCategory);
router.get('/chude/:slug', requireManagerLogin, initSortable, categoryController.categoryDetails);


router.post('/chude/:slug/them-phanloai/luu', requireManagerLogin, uploader.single('icon'), typeController.saveType);
router.post('/chude/:slug/phanloai/:typeslug/sua', requireManagerLogin, uploader.single('icon'), typeController.saveModifiedType);
router.delete('/phanloai/xoa', requireManagerLogin, typeController.deleteType);

router.get('/chude/:slug/phanloai/:typeslug/sua', requireManagerLogin, typeController.modifyType);
router.get('/chude/:slug/them-phanloai', requireManagerLogin, typeController.addType);

router.post('/sanpham/them', requireManagerLogin, uploader.array('images', 20), productController.saveProduct);
router.post('/sanpham/:slug/sua', requireManagerLogin, uploader.array('images', 20), productController.saveModifiedProduct);
router.patch('/sanpham/xoa', requireManagerLogin, productController.deleteProduct);
router.patch('/sanpham/xoachon', requireManagerLogin, productController.deleteManyProducts);

router.get('/sanpham/:slug/sua', requireManagerLogin, productController.modifyProduct);
router.get('/sanpham/them', requireManagerLogin, productController.addProduct);
router.get('/sanpham/:slug', requireManagerLogin, productController.productDetails);
router.get('/sanpham', requireManagerLogin, initSortable, productController.productManagement);
router.get('/', requireManagerLogin, productController.productManagement);


module.exports = router;
