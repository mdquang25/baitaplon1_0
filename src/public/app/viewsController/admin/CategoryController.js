const Category = require('../../models/ProductCategory');
const Type = require('../../models/ProductType');
const Product = require('../../models/Product');
const { multiMongooseToObjs, mongooseToObj } = require('../../../../util/mongoose');
const fs = require('fs');
const path = require('path');

class CategoryController {
    index(req, res, next) {
        console.log('categories - admin');
        Category.find({}).sortList(req)
            .then((docs) => {
                const categories = multiMongooseToObjs(docs);
                const promises = categories.map((category) => {
                    return Type.find({ categoryId: category._id })
                        .then((types) => {
                            const type_ids = types.map(type => type._id);
                            category.typeCount = types.length;
                            return Product.countDocuments({ typesIds: { $in: type_ids } })
                                .then((count) => {
                                    category.productCount = count;
                                    return category;
                                });
                        });
                });
                Promise.all(promises)
                    .then(categories => {
                        Type.countDocuments({})
                            .then((typeCount) => {
                                if (req.query.hasOwnProperty('sort')) {
                                    const sortList = {
                                        asc: (a, b) => b[req.query.field] - a[req.query.field],
                                        desc: (a, b) => a[req.query.field] - b[req.query.field]
                                    }
                                    const isValidType = ['asc', 'desc'].includes(req.query.type);
                                    if (['typeCount', 'productCount'].includes(req.query.field)) {
                                        categories.sort(sortList[isValidType? req.query.type : 'desc']);
                                    }
                                }
                                res.render('admin/product/categories-types', {
                                    pageTitle: 'Quản lý phân loại',
                                    layout: 'admin',
                                    categories,
                                    typeCount,
                                });
                            });
                    })

            })
            .catch(next);
    }

    addCategory(req, res) {
        console.log('add category- admin');
        res.render('admin/product/add-category', { pageTitle: 'Thêm phân chủ đề', layout: 'admin', });
    }

    //[POST] /admin/kho/chude/luu
    saveCategory(req, res) {
        console.log('save category - admin');
        const category = new Category(req.body);
        category.save();
        console.log('category is saved!');
        //add some check funtion if category already exist
        //...
        res.redirect('back');
    }

    //[DELETE] /admin/kho/chude/xoa
    deleteCategory(req, res, next) {
        console.log('delete category - admin');
        Category.findByIdAndDelete(req.body.deleteId)
            .then(category => {
                Type.find({ categoryId: category._id })
                    .then(types => {
                        console.log('deletemany: ', types);
                        types.forEach(type => {
                            Product.updateMany({ typesIds: type._id },
                                { $pull: { typesIds: type._id } });
                            if (type.imageUrl)
                                fs.unlink(path.join(__dirname, '..', '..', '..', type.imageUrl), (err) => {
                                    if (err) {
                                        console.error(url + err);
                                        return;
                                    }
                                    console.log(type.imageUrl + ': deleted successfully');
                                });
                        });
                        Type.deleteMany({ categoryId: category._id }).catch(next);
                    }).catch(next);
            }).catch(next);
        res.redirect('back');
    }

    //[GET] /admin/kho/chude/:slug/sua
    modifyCategory(req, res, next) {
        console.log('modify category - admin');
        Category.findOne({ slug: req.params.slug })
            .then(category => {
                res.render('admin/product/modify-category', { pageTitle: 'Sửa chủ đề', layout: 'admin', category: mongooseToObj(category), isAdmin: req.session.isAdmin, });
            }).catch(next);
    }
    //[PATCH] /admin/kho/chude/:slug/sua
    saveModifiedCategory(req, res) {
        console.log('save modify category - admin');
        Category.findOneAndUpdate({ slug: req.params.slug }, { $set: { name: req.body.name, description: req.body.description, } },)
            .then(res.redirect('/admin/kho/chude-phanloai'))
            .catch(next);
    }

    //[GET] /admin/kho/chude/:slug
    categoryDetails(req, res, next) {
        console.log('category details - admin');
        Category.findOne({ slug: req.params.slug })
            .then((doc) => {
                const category = mongooseToObj(doc);
                Type.find({ categoryId: category._id })
                    .then((docs) => {
                        const types = multiMongooseToObjs(docs);
                        category.typeCount = types.length;
                        const type_ids = types.map(type => type._id);
                        Product.find({ typesIds: { $in: type_ids } })
                            .then((products) => {
                                category.productCount = products.length;
                                Promise.all(types.map(type => {
                                    return Product.find({ typesIds: type._id })
                                        .then(products => {
                                            type.productCount = products.length;
                                        });
                                })).then(() => {
                                    res.render('admin/product/category-details', {
                                        pageTitle: 'Chi tiết phân loại',
                                        layout: 'admin',
                                        category,
                                        types,
                                        isAdmin: req.session.isAdmin,
                                    });
                                });
                            });
                    });
            }).catch(next);
    }
}

module.exports = new CategoryController;