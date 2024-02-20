const Product = require('../../models/Product');
const { mongooseToObj, multiMongooseToObjs } = require('../../../../util/mongoose');

class ProductController {
    productDetails(req, res, next) {
        Product.findOne({ slug: req.params.slug })
            .then(product => {
                console.log(res.locals.cart);
                res.render('customer/product/product-details', { pageTitle: product.name, product: mongooseToObj(product), isLoggedin: req.session.isLoggedin, cart: res.locals.cart, shopInfo: res.locals.shopInfo, })
            })
    }
}

module.exports = new ProductController;