const ProductCategory = require('../../public/app/models/ProductCategory');
const { multiMongooseToObjs } = require('../../util/mongoose');

const getCategories = (req, res, next) => {
        ProductCategory.find({})
            .then(docs => {
                if (docs) {
                    res.locals.categories = multiMongooseToObjs(docs);
                }
                next();
            }).catch(next);
};

module.exports = getCategories;