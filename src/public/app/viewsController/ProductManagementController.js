const Category = require('../models/ProductCategory');
const Type = require('../models/ProductType');
const Product = require('../models/Product');
const { multiMongooseToObjs, mongooseToObj } = require('../../../util/mongoose');
const fs = require('fs');
const path = require('path');

class ProductManagementController {
    productManagement(req, res, next) {
        Product.find({})
            .then(products => {

                res.render('admin/product/products', { pageTitle: 'Quản lý sản phẩm', layout: 'admin', manager: req.session.manager, products: multiMongooseToObjs(products), });
            }).catch(next);
    }

    //[GET] //admin/kho/sanpham/them
    addProduct(req, res, next) {
        console.log('addProduct');
        Category.find({})
            .then(categories => {
                const objs = multiMongooseToObjs(categories);
                const categoryPromises = objs.map(category => {
                    return Type.find({ categoryId: category._id })
                        .then(types => {
                            const tps = multiMongooseToObjs(types);
                            category.types = tps;
                            return category;
                        });
                });

                return Promise.all(categoryPromises);
            })
            .then(objs => {
                console.log(objs);
                res.render('admin/product/add-product', { pageTitle: 'Thêm sản phẩm', layout: 'admin', manager: req.session.manager, categories: objs });
            })
            .catch(next);
    }
    //[POST] //admin/kho/sanpham/them
    saveProduct(req, res, next) {
        const product = new Product(req.body);
        const files = req.files;
        console.log('files: ', files);
        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => '/uploads/' + file.filename);
            product.imagesUrls = imagePaths;
        };

        product.save();
        console.log('product is saved!');
        //add some check funtion if category already exist
        //...
        res.redirect('back');
    }

    //[GET] //admin/kho/sanpham/:slug
    productDetails(req, res, next) {
        console.log('details');
        Product.findOne({ slug: req.params.slug })
            .then(product => {
                if (product) Type.find({ _id: { $in: product.typesIds } })
                    .then(types => {
                        res.render('admin/product/product-details', { pageTitle: 'Sửa sản phẩm', layout: 'admin', manager: req.session.manager, product: mongooseToObj(product), types: multiMongooseToObjs(types), })
                    }).catch(next);
                return;
            }).catch(next);
    }
    //[GET] //admin/kho/sanpham/sua/:slug
    modifyProduct(req, res, next) {
        Category.find({})
            .then(items => {
                const categories = multiMongooseToObjs(items);
                categories.forEach(category => {
                    Type.find({ categoryId: category._id })
                        .then(types => {
                            category.types = multiMongooseToObjs(types);
                            console.log(types);
                        })
                        .catch(next);
                });
                Product.findOne({ slug: req.params.slug })
                    .then(product => {
                        res.render('admin/product/modify-product', { pageTitle: 'Sửa sản phẩm', layout: 'admin', manager: req.session.manager, categories, product: mongooseToObj(product), })
                    }).catch(next);
            }).catch(next);
    }
    //[PUT] //admin/kho/sanpham/sua
    saveModifiedProduct(req, res, next) {
        console.log('files: ', req.files);
        Product.findOne({ slug: req.params.slug })
            .then(product => {
                product.name = req.body.name;
                product.description = req.body.description;
                product.stock = parseInt(product.stock) + parseInt(req.body.import);
                product.count = parseInt(product.count) + parseInt(req.body.import);
                product.onSale = req.body.onSale;
                product.oldPrice = req.body.oldPrice;
                product.price = req.body.price;
                product.mainImageIndex = req.body.mainImageIndex;
                product.typesIds = req.body.typesIds;
                const oldUrls = product.imagesUrls;
                product.imagesUrls = req.body.imagesUrls;
                const files = req.files;
                console.log(files);
                if (files && files.length > 0) {
                    const imagePaths = files.map(file => '/uploads/' + file.filename);
                    console.log('imagePaths: ', imagePaths);

                    if (product.imagesUrls && product.imagesUrls.length > 0)
                        product.imagesUrls.push(...imagePaths);
                    else
                        product.imagesUrls = imagePaths;
                    console.log('product.imagesUrls: ', product.imagesUrls);

                };
                const unwantedUrls = oldUrls.filter(element => !req.body.imagesUrls.includes(element));
                unwantedUrls.forEach(function (url) {
                    fs.unlink(path.join(__dirname, '..', '..', url), (err) => {
                        if (err) {
                            console.error(url + err);
                            return;
                        }
                        console.log(url + ': deleted successfully');
                    });
                });

                product.save();
                console.log('product modify is saved!');
                //add some check funtion if category already exist
                //...
                res.redirect('/admin/kho/sanpham');
            }).catch(next);
    }
    //[PATCH] /admin/kho/sanpham/xoa/:id
    deleteProduct(req, res, next) {
        Product.findByIdAndDelete(req.body.deleteId)
            .then((product) => {
                product.imagesUrls.forEach(function (url) {
                    fs.unlink(path.join(__dirname, '..', '..', url), (err) => {
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
    //=====================================================================================
    typeManagement(req, res, next) {
        Category.find({})
            .then((categories) => {
                let typeCount = 0;
                categories.forEach(category => typeCount += category.typeCount);
                res.render('admin/product/categories-types', { pageTitle: 'Quản lý phân loại', layout: 'admin', manager: req.session.manager, categories: multiMongooseToObjs(categories), typeCount, })
            })
            .catch(next);
    }

    addCategory(req, res) {
        res.render('admin/product/add-category', { pageTitle: 'Thêm phân chủ đề', layout: 'admin', manager: req.session.manager, });
    }

    //[POST] /admin/kho/chude/luu
    saveCategory(req, res) {
        const category = new Category(req.body);
        category.save();
        console.log('category is saved!');
        //add some check funtion if category already exist
        //...
        res.redirect('back');
    }

    //[DELETE] /admin/kho/chude/xoa
    deleteCategory(req, res, next) {
        Category.findByIdAndDelete(req.body.deleteId)
            .then(category => {
                Type.find({ categoryId: category._id })
                    .then(types => {
                        console.log('deletemany: ', types);
                        types.forEach(type => {
                            Product.updateMany({ typesIds: type._id },
                                { $pull: { typesIds: type._id } });
                            if (type.imageUrl)
                                fs.unlink(path.join(__dirname, '..', '..', type.imageUrl), (err) => {
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
        Category.findOne({ slug: req.params.slug })
            .then(category => {
                res.render('admin/product/modify-category', { pageTitle: 'Sửa chủ đề', layout: 'admin', category: mongooseToObj(category), });
            }).catch(next);
    }
    //[PATCH] /admin/kho/chude/:slug/sua
    saveModifiedCategory(req, res) {
        Category.findOneAndUpdate({ slug: req.params.slug }, { $set: { name: req.body.name, description: req.body.description, } },)
            .then(res.redirect('/admin/kho/chude-phanloai'))
            .catch(next);
    }

    //[GET] /admin/kho/chude/:slug
    categoryDetails(req, res, next) {
        Category.findOne({ slug: req.params.slug })
            .then(category => {
                Type.find({ categoryId: category._id })
                    .then(types => {
                        let objs = null;
                        if (types && types.length > 0)
                            objs = multiMongooseToObjs(types);
                        res.render('admin/product/category-details', { pageTitle: 'Chi tiết phân loại', layout: 'admin', category: mongooseToObj(category), types: objs, });
                    }).catch(next);
            }).catch(next);
    }

    //[GET] /admin/kho/chude/:slug/them-phanloai
    addType(req, res, next) {
        Category.findOne({ slug: req.params.slug }).then((category) => {
            res.render('admin/product/add-type', { pageTitle: 'Thêm phân loại', layout: 'admin', manager: req.session.manager, category: mongooseToObj(category) });
        }).catch(next);
    }
    //[POST] /admin/kho/chude/:slug/them-phanloai/luu
    saveType(req, res) {
        Category.findOne({ slug: req.params.slug })
            .then(category => {
                category.typeCount += 1;
                const type = new Type(req.body);
                const file = req.file;
                if (!file) {
                    console.log("no icon!");
                }
                else {
                    type.imageUrl = '/uploads/' + file.filename;
                }
                category.save();
                type.save();
                console.log('type is saved!');

                res.redirect('back');
            })
        //add some check funtion if category already exist
        //...
    }

    //[GET] /admin/kho/chude/:slug/phanloai/:typeslug/sua
    modifyType(req, res, next) {
        Category.findOne({ slug: req.params.slug }).then((category) => {
            Type.findOne({ slug: req.params.typeslug }).then((type) => {
                res.render('admin/product/modify-type', { pageTitle: 'Sửa phân loại', layout: 'admin', manager: req.session.manager, category: mongooseToObj(category), type: mongooseToObj(type), });
            }).catch(next);
        }).catch(next);
    }
    //[PATCH] /admin/kho/chude/:slug/phanloai/:typeslug/sua
    saveModifiedType(req, res, next) {
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
                        fs.unlink(path.join(__dirname, '..', '..', type.imageUrl), (err) => {
                            if (err) {
                                console.error(url + err);
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
        Type.findByIdAndDelete(req.body.deleteId)
            .then(type => {
                if (type.imageUrl)
                    fs.unlink(path.join(__dirname, '..', '..', type.imageUrl), (err) => {
                        if (err) {
                            console.error(url + err);
                            return;
                        }
                        console.log(type.imageUrl + ': deleted successfully');
                    });
                Category.findByIdAndUpdate(req.body.categoryId, { $inc: { typeCount: - 1, } })
                    .then(() => {
                        Product.updateMany({ typesIds: type._id },
                            { $pull: { typesIds: type._id } })
                            .then(() => {
                                res.redirect('back');
                            }).catch(next);
                    }).catch(next);
            }).catch(next);
    }

}

module.exports = new ProductManagementController;