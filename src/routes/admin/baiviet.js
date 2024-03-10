const express = require('express');
const router = express.Router();
const requireManagerLogin = require('../middleware/requireManagerLogin');
const uploader = require('../middleware/uploader');
const baivietController = require('../../public/app/viewsController/admin/BaivietController');


router.post('/:slug/luu', requireManagerLogin, uploader.array('images', 10), baivietController.saveModify);
router.post('/them', requireManagerLogin, uploader.array('images', 10), baivietController.save);
router.patch('/xoa', requireManagerLogin, baivietController.delete);
router.patch('/xoachon', requireManagerLogin, baivietController.deleteMany);

router.get('/them', requireManagerLogin, baivietController.add);
router.get('/:slug', requireManagerLogin, baivietController.modify);
router.get('/', requireManagerLogin, baivietController.index);

module.exports = router;