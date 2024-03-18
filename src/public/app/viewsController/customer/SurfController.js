const Product = require('../../models/Product');
const Category = require('../../models/ProductCategory');
const Type = require('../../models/ProductType');
const Carousel = require('../../models/Carousel');

const { mongooseToObj, multiMongooseToObjs } = require('../../../../util/mongoose');

class ProductController {
    searchProductByCategory(req, res, next) {
        console.log('search category - customer');
        Category.find({})
            .then(docs => {
                const objs = multiMongooseToObjs(docs);
                var selectedCategory;
                const categories = objs.map(category => {

                    return Type.find({ categoryId: category._id })
                        .then(types => {
                            const tps = multiMongooseToObjs(types);
                            if (category.slug === req.params.slug) {
                                selectedCategory = category;
                                selectedCategory.typesIds = tps.map(type => type._id);
                            }
                            category.types = tps;
                            return category;
                        });
                });
                console.log('category: ', selectedCategory);
                Promise.all(categories).then(categories => {
                    Promise.all([Product.find({ typesIds: { $in: selectedCategory.typesIds } }), Carousel.find({})])
                        .then(([products, carousels]) => {
                            res.render('customer/home', { pageTitle: selectedCategory.name, isLoggedin: req.session.isLoggedin, categories, products: multiMongooseToObjs(products), carousels: multiMongooseToObjs(carousels), });
                        }).catch(next);
                }).catch(next);
            }).catch(next);
    }

    productDetails(req, res, next) {
        console.log('product details - customer');
        Product.findOne({ slug: req.params.slug })
            .then(product => {
                res.render('customer/product/product-details', { pageTitle: product.name, product: mongooseToObj(product), isLoggedin: req.session.isLoggedin, })
            })
    }

    searchProductByAJAX(req, res) {
        Product.find({ $text: { $search: req.query.query } })
            .then(docs => {
                res.send({ products: multiMongooseToObjs(docs) });
            })
    }

    searchProductByPost(req, res, next) {
        console.log('Search POST - customer');
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
                Promise.all(categories).then(categories => {
                    Promise.all([Product.find({ $text: { $search: req.body.query } }), Carousel.find({})])
                        .then(([products, carousels]) => {
                            res.render('customer/home', { pageTitle: 'Tìm kiếm', isLoggedin: req.session.isLoggedin, user: req.session.user, categories, products: multiMongooseToObjs(products), carousels: multiMongooseToObjs(carousels), cart: res.locals.cart, shopInfo: res.locals.shopInfo, });
                        }).catch(next);
                }).catch(next);
            }).catch(next);
    }

    //[POST] /sanpham/loc
    filter(req, res, next) {
        console.log('products filter - customer');
        Product.find({
            price: { $gte: req.body.minPrice[0], $lte: req.body.maxPrice[0] },
            typesIds: { $in: req.body.typesIds }
        }).then(products => {
            res.send(multiMongooseToObjs(products));
        }).catch(next);
    }

}

module.exports = new ProductController;