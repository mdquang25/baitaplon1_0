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
        res.redirect('/admin/cuahang/thongtin');
    }

    info(req, res, next) {
        console.log('shop info - admin');
        ShopInfo.findOne({})
            .then(doc => {
                let info;
                if (doc)
                    info = mongooseToObj(doc);
                res.render('admin/shop-info/info', { pageTitle: 'Quản lý thông tin cửa hàng', layout: 'admin', info, });
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

    //[POST] /admin/shop/quangcao/:id/luu
    saveModifyCarousel(req, res, next) {
        console.log('save modify carousel - admin');
        Carousel.findById(req.params.id)
            .then(carousel => {
                if (carousel) {
                    const file = req.file;
                    if (!file) {
                        console.log("no icon!");
                    }
                    else {
                        fs.unlink(path.join(__dirname, '..', '..', '..', carousel.imageUrl), (err) => {
                            if (err) {
                                console.error(carousel.imageURl + err);
                                return;
                            }
                            console.log(imageUrl + ': deleted successfully');
                        });
                        carousel.imageUrl = '/uploads/' + file.filename;
                        carousel.save();
                    }
                }
                res.redirect('/admin/cuahang/quangcao');
            }).catch(() => redirect('/admin/cuahang/quangcao'));
    }

    modifyCarousel(req, res, next) {
        console.log('modify carousel - admin');
        Carousel.findOne({ _id: req.params.id })
            .then(carousel => {
                if (carousel) {
                    res.render('admin/shop-info/modify-carousel', { pageTitle: 'Sửa quảng cáo', layout: 'admin', carousel: mongooseToObj(carousel), });
                }
                else
                    res.redirect('not-found-404');
            }).catch(() => res.redirect('not-found-404'));
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
                res.render('admin/shop-info/carousels', { pageTitle: 'Tin quảng cáo', layout: 'admin', carousels, });
            }).catch(next);
    }
    //[GET] /admin/shop/quangcao/them
    addCarousel(req, res, next) {
        console.log('add carousel - admin');
        res.render('admin/shop-info/add-carousel', { pageTitle: 'Thêm tin quảng cáo', layout: 'admin', });
    }
}

module.exports = new ShopInfoController();
