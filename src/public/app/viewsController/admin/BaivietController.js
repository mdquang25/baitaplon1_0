const Baiviet = require("../../models/Baiviet");
const { multiMongooseToObjs, mongooseToObj } = require('../../../../util/mongoose');
const fs = require('fs');
const path = require('path');

class BaivietController {
    index(req, res, next) {
        Baiviet.find({})
            .then(docs => {
                res.render('admin/baiviet/list', { pageTitle: 'Quản lý bài viết', layout: 'admin', baiviets: multiMongooseToObjs(docs), isAdmin: req.session.isAdmin, })
            })
    }
    add(req, res, next) {
        res.render('admin/baiviet/add', { pageTitle: 'Thêm bài viết', layout: 'admin', isAdmin: req.session.isAdmin, })
    }

    async save(req, res, next) {
        console.log('save baiviet - admin');
        const baiviet = new Baiviet(req.body);
        const files = req.files;

        if (files && files.length > 0) {
            const imagePaths = files.map((file) => '/uploads/' + file.filename);
            baiviet.imagesUrls = imagePaths;
        }

        try {
            await baiviet.save();
            console.log('baiviet is saved!');
        } catch (error) {
            next(error); // Pass the error to the error handling middleware
            return; // Return early to prevent sending the response
        }

        res.redirect('back');
    }

    modify(req, res, next) {
        Baiviet.findOne({ slug: req.params.slug })
            .then(doc => {
                if (doc)
                    res.render('admin/baiviet/modify', { pageTitle: 'Sửa bài viết', layout: 'admin', baiviet: mongooseToObj(doc), isAdmin: req.session.isAdmin, })
                else
                    res.redirect('not-found-404');
            }).catch(() => {
                res.redirect('/not-found-404');
            })
    }

    saveModify(req, res, next) {
        console.log('save modified baiviet - admin');
        Baiviet.findOne({ slug: req.params.slug })
            .then(baiviet => {
                if (baiviet) {
                    baiviet.name = req.body.name;
                    baiviet.description = req.body.description;
                    baiviet.mainImageIndex = req.body.mainImageIndex;
                    const oldUrls = baiviet.imagesUrls;
                    baiviet.imagesUrls = req.body.imagesUrls;
                    const files = req.files;
                    if (files && files.length > 0) {
                        const imagePaths = files.map(file => '/uploads/' + file.filename);
                        console.log('imagePaths: ', imagePaths);

                        if (baiviet.imagesUrls && baiviet.imagesUrls.length > 0)
                            baiviet.imagesUrls.push(...imagePaths);
                        else
                            baiviet.imagesUrls = imagePaths;
                    };
                    if (oldUrls && oldUrls.length > 0) {
                        var unwantedUrls;
                        if (req.body.imagesUrls)
                            unwantedUrls = oldUrls.filter(element => !req.body.imagesUrls.includes(element));
                        else
                            unwantedUrls = oldUrls;
                        unwantedUrls.forEach(function (url) {
                            fs.unlink(path.join(__dirname, '..', '..', '..', url), (err) => {
                                if (err) {
                                    console.error(url + err);
                                    return;
                                }
                                console.log(url + ': deleted successfully');
                            });
                        });
                    }
                    baiviet.save();
                    console.log('baiviet modify is saved!');
                }
                else
                    console.log('baiviet modify save failed!');

                res.redirect('/admin/baiviet');
            }).catch(next);
    }

    //[PATCH] /admin/baiviet/xoa
    delete(req, res, next) {
        console.log('delete baiviet - admin');
        Baiviet.findByIdAndDelete(req.body.deleteId)
            .then((baiviet) => {
                baiviet.imagesUrls.forEach(function (url) {
                    fs.unlink(path.join(__dirname, '..', '..', '..', url), (err) => {
                        if (err) {
                            console.error(url + err);
                            return;
                        }
                        console.log(url + ': deleted successfully');
                    });
                });
                res.redirect('back');
            }).catch(next);
    }
    //[PATCH] /admin/baiviet/xoachon
    deleteMany(req, res, next) {
        console.log('delete many baiviet - admin');
        Baiviet.find({ _id: { $in: req.body.baiviet_ids } })
            .then((docs) => {
                if (docs) {
                    Array.from(docs).forEach(baiviet => {
                        baiviet.imagesUrls.forEach(function (url) {
                            fs.unlink(path.join(__dirname, '..', '..', '..', url), (err) => {
                                if (err) {
                                    console.error(url + err);
                                    return;
                                }
                                console.log(url + ': deleted successfully');
                            });
                        });
                    });
                    Baiviet.removeMany({ _id: { $in: req.body.baiviet_ids } })
                        .then(() => {
                            res.redirect('back');
                        });
                }
                else
                    res.redirect('back');
            }).catch(next);
    }
}

module.exports = new BaivietController;