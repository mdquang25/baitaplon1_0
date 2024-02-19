const Category = require('../../models/ProductCategory');
const Type = require('../../models/ProductType');
const Product = require('../../models/Product');
const { multiMongooseToObjs, mongooseToObj } = require('../../../../util/mongoose');
const fs = require('fs');
const path = require('path');
//const bucket = require('../../../config/firebaseStorage');
//const admin = require('../../../config/firebaseAdmin');
//const { ref, getDownloadURL, uploadBytes } = require('firebase-admin');

class ProductController {
    productManagement(req, res, next) {
        Product.find({})
            .then(products => {
                res.render('admin/product/products', { pageTitle: 'Quản lý sản phẩm', layout: 'admin', isAdmin: req.session.isAdmin, products: multiMongooseToObjs(products), });
            }).catch(next);
    }

    //[GET] //admin/kho/sanpham/them
    addProduct(req, res, next) {
        console.log('addProduct');
        Category.find({})
            .then(docs => {
                const objs = multiMongooseToObjs(docs);
                const categories = objs.map(category => {
                    return Type.find({ categoryId: category._id })
                        .then(types => {
                            const tps = multiMongooseToObjs(types);
                            category.types = tps;
                            return category;
                        });
                });

                return Promise.all(categories);
            })
            .then(categories => {
                res.render('admin/product/add-product', { pageTitle: 'Thêm sản phẩm', layout: 'admin', isAdmin: req.session.isAdmin, categories });
            })
            .catch(next);
    }
    //[POST] //admin/kho/sanpham/them
    async saveProduct(req, res, next) {
        const product = new Product(req.body);
        const files = req.files;

        if (files && files.length > 0) {
            const imagePaths = files.map((file) => '/uploads/' + file.filename);
            product.imagesUrls = imagePaths;

            // files.forEach((file) => {
            //     bucket.upload('src/public/uploads/' + file.filename, {
            //         gzip: true,
            //         destination: 'images/' + file.filename,
            //         metadata: {
            //             contentType: file.mimetype,
            //             cacheControl: 'public, max-age=31536000'
            //         }
            //     });
            //     product.imagesUrls.push(bucket.file('images/' + file.filename).publicUrl());
            // });
        }

        try {
            await product.save();
            console.log('Product is saved!');
        } catch (error) {
            next(error); // Pass the error to the error handling middleware
            return; // Return early to prevent sending the response
        }

        res.redirect('back');
    }

    //[GET] //admin/kho/sanpham/:slug
    productDetails(req, res, next) {
        console.log('details');
        Product.findOne({ slug: req.params.slug })
            .then(product => {
                if (product) Type.find({ _id: { $in: product.typesIds } })
                    .then(types => {
                        res.render('admin/product/product-details', { pageTitle: 'Sửa sản phẩm', layout: 'admin', isAdmin: req.session.isAdmin, product: mongooseToObj(product), types: multiMongooseToObjs(types), })
                    }).catch(next);
                return;
            }).catch(next);
    }
    //[GET] //admin/kho/sanpham/sua/:slug
    modifyProduct(req, res, next) {
        Category.find({})
            .then(docs => {
                const objects = multiMongooseToObjs(docs);
                const categories = objects.map(category => {
                    return Type.find({ categoryId: category._id })
                        .then(types => {
                            category.types = multiMongooseToObjs(types);
                            return category;
                        });
                });
                return Promise.all(categories);
            }).then(categories => {
                Product.findOne({ slug: req.params.slug })
                    .then(obj => {
                        const product = mongooseToObj(obj);
                        res.render('admin/product/modify-product', { pageTitle: 'Sửa sản phẩm', layout: 'admin', isAdmin: req.session.isAdmin, categories, product, })
                    }).catch(next);
            })
    }
    //[PUT] //admin/kho/sanpham/sua
    saveModifiedProduct(req, res, next) {
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

                    files.forEach(file => {
                        bucket.upload('src/public/uploads/' + file.filename, {
                            gzip: true,
                            destination: 'images/' + file.filename,
                            metadata: {
                                contentType: file.mimetype,
                                cacheControl: 'public, max-age=31536000'
                            }
                        })
                        const imageRef = bucket.ref().child('path/to/image.jpg');
                        imageRef.getDownloadURL()
                    })

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
}

module.exports = new ProductController;