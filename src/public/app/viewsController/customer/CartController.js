const Customer = require('../../models/Customer');
const Cart = require('../../models/Cart');
const ProductQ = require('../../models/ProductQ');
const Category = require('../../models/ProductCategory');
const Type = require('../../models/ProductType');
const Product = require('../../models/Product');
const ShopInfo = require('../../models/ShopInfo');
const { multiMongooseToObjs, mongooseToObj } = require('../../../../util/mongoose')
const { validationResult } = require('express-validator');

class CartController {
    //[GET] /giohang/them/:slug
    addProduct(req, res, next) {
        Cart.findById(req.session.user.cartId)
            .then(cart => {
                ProductQ.findOne({ cartId: cart._id, productSlug: req.params.slug })
                    .then(doc => {
                        if (doc) {
                            doc.quantity++;
                            doc.save();
                        }
                        else {
                            const productQ = new ProductQ({
                                cartId: cart._id,
                                productSlug: req.params.slug,
                                quantity: 1,
                            });
                            productQ.save();
                        }
                    })
            })
        res.redirect('back');
    }
}

module.exports = new CartController();
