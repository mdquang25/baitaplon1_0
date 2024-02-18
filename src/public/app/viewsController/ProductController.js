const Product = require('../models/Product');
const { mongooseToObj, multiMongooseToObjs } = require('../../../util/mongoose');

class ProductController {
    productDetails(req, res, next) {
        Product.findOne({ slug: req.params.slug })
            .then(product => {
                res.render('customer/product/product-details', { pageTitle: product.name, product: mongooseToObj(product), isLoggedin: req.session.isLoggedin, })
            })
    }
}

module.exports = new ProductController;