const Admin = require('../../models/Admin');
const ShopInfo = require('../../models/ShopInfo');
const Carousel = require('../../models/Carousel');
const { multiMongooseToObjs, mongooseToObj } = require('../../../../util/mongoose');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

class ShopInfoController {
    index(req, res) {
        console.log('shop - admin');
        res.redirect('/admin/shop/thongtin');
    }

    info(req, res, next) {
        console.log('shop info - admin');
        ShopInfo.findOne({})
            .then(doc => {
                let info;
                if (doc)
                    info = mongooseToObj(doc);
                res.render('admin/shop-info/info', { pageTitle: 'Quản lý thông tin cửa hàng', layout: 'admin', info, isAdmin: req.session.isAdmin, });
            })
    }

    //[PUT] /admin/shop/thongtin/luu
    saveInfo(req, res, next) {
        console.log('save shop info - admin');
        ShopInfo.findOneAndUpdate({}, req.body)
            .then(doc => {
                if (!doc) {
                    const info = new ShopInfo(req.body);
                    info.save();
                    res.redirect('back');
                }
                else
                    res.redirect('back');
            }).catch(next);
    }
    //[POST] /admin/shop/quangcao/luu
    saveCarousel(req, res, next) {
        console.log('save carousel - admin');
        const carousel = new Carousel(req.body);
        const file = req.file;
        if (!file) {
            console.log("no icon!");
        }
        else {
            carousel.imageUrl = '/uploads/' + file.filename;
        }
        carousel.save();
        res.redirect('back');
    }

    //[GET] /admin/shop/quangcao
    carousels(req, res, next) {
        console.log('carousels - admin');
        Carousel.find({})
            .then(docs => {
                var carousels;
                if (docs) {
                    carousels = multiMongooseToObjs(docs);
                }
                res.render('admin/shop-info/carousels', { pageTitle: 'Tin quảng cáo', layout: 'admin', carousels, isAdmin: req.session.isAdmin, });
            }).catch(next);
    }
    //[GET] /admin/shop/quangcao/them
    addCarousel(req, res, next) {
        console.log('add carousel - admin');
        res.render('admin/shop-info/add-carousel', { pageTitle: 'Thêm tin quảng cáo', layout: 'admin', isAdmin: req.session.isAdmin, });  
    }
}

module.exports = new ShopInfoController();
