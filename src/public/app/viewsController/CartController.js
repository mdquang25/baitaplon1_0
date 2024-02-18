const Customer = require('../models/Customer');
const Category = require('../models/ProductCategory');
const Type = require('../models/ProductType');
const Product = require('../models/Product');
const { multiMongooseToObjs, mongooseToObj } = require('../../../util/mongoose')
const { validationResult } = require('express-validator');

class CartController {
    addProduct(req, res, next) {
        
        res.redirect('back');
    }
}

module.exports = new CartController();
