const Product = require('../../models/Product');
const Category = require('../../models/ProductCategory');
const Type = require('../../models/ProductType');
const Carousel = require('../../models/Carousel');

const { mongooseToObj, multiMongooseToObjs } = require('../../../../util/mongoose');

class ProductController {
    productDetails(req, res, next) {
        console.log('product details - customer');
        Product.findOne({ slug: req.params.slug })
            .then(product => {
                res.render('customer/product/product-details', { pageTitle: product.name, product: mongooseToObj(product), isLoggedin: req.session.isLoggedin, cart: res.locals.cart, shopInfo: res.locals.shopInfo, })
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