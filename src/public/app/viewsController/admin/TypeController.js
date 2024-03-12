const Category = require('../../models/ProductCategory');
const Type = require('../../models/ProductType');
const Product = require('../../models/Product');
const { multiMongooseToObjs, mongooseToObj } = require('../../../../util/mongoose');
const fs = require('fs');
const path = require('path');

class TypeController {
    //[GET] /admin/kho/chude/:slug/them-phanloai
    addType(req, res, next) {
        console.log('add type - admin');
        Category.findOne({ slug: req.params.slug }).then((category) => {
            res.render('admin/product/add-type', { pageTitle: 'Thêm phân loại', layout: 'admin', isAdmin: req.session.isAdmin, category: mongooseToObj(category) });
        }).catch(next);
    }
    //[POST] /admin/kho/chude/:slug/them-phanloai/luu
    saveType(req, res) {
        console.log('add type - admin');
        const type = new Type(req.body);
        const file = req.file;
        if (!file) {
            console.log("no icon!");
        }
        else {
            type.imageUrl = '/uploads/' + file.filename;
        }
        type.save();
        console.log('type is saved!');

        res.redirect('back');
        //add some check funtion if category already exist
        //...
    }

    //[GET] /admin/kho/chude/:slug/phanloai/:typeslug/sua
    modifyType(req, res, next) {
        console.log('modify type - admin');
        Category.findOne({ slug: req.params.slug }).then((category) => {
            Type.findOne({ slug: req.params.typeslug }).then((type) => {
                res.render('admin/product/modify-type', { pageTitle: 'Sửa phân loại', layout: 'admin', isAdmin: req.session.isAdmin, category: mongooseToObj(category), type: mongooseToObj(type), });
            }).catch(next);
        }).catch(next);
    }
    //[PATCH] /admin/kho/chude/:slug/phanloai/:typeslug/sua
    saveModifiedType(req, res, next) {
        console.log('save modify type - admin');
        Type.findOne({ slug: req.params.typeslug })
            .then(type => {
                type.name = req.body.name;
                type.description = req.body.description;
                const file = req.file;
                if (!file) {
                    console.log("no icon!");
                }
                else {
                    if (type.imageUrl)
                        fs.unlink(path.join(__dirname, '..', '..', '..', type.imageUrl), (err) => {
                            if (err) {
                                console.error(type.imageUrl + err);
                                return;
                            }
                            console.log(type.imageUrl + ': deleted successfully');
                        });
                    type.imageUrl = '/uploads/' + file.filename;
                }
                type.save();
                res.redirect('/admin/kho/chude/' + req.params.slug);
            }).catch(next);
    }

    //[DELETE] /admin/kho/phanloai/xoa
    deleteType(req, res, next) {
        console.log('delete type - admin');
        Type.findByIdAndDelete(req.body.deleteId)
            .then(type => {
                if (type.imageUrl)
                    fs.unlink(path.join(__dirname, '..', '..', '..', type.imageUrl), (err) => {
                        if (err) {
                            console.error(type.imageUrl + err);
                            return;
                        }
                        console.log(type.imageUrl + ': deleted successfully');
                    });
                Product.updateMany({ typesIds: type._id },
                    { $pull: { typesIds: type._id } })
                    .then(() => {
                        res.redirect('back');
                    }).catch(next);

            }).catch(next);
    }

}

module.exports = new TypeController;