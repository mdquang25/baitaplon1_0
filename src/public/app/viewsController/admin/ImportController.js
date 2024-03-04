const { mongooseToObj, multiMongooseToObjs } = require("../../../../util/mongoose");
const Product = require("../../models/Product");



class ImportController {
    import(req, res) {
        res.render('admin/product/import', { pageTitle: 'Nhập hàng', layout: 'admin', isAdmin: req.session.isAdmin, })
    }
    history(req, res, next) {
        res.render('admin/product/import', { pageTitle: 'Lịch sử nhập hàng', layout: 'admin', isAdmin: req.session.isAdmin, })

    }

    //[GET] /admin/kho/nhaphang/tim-san-pham
    findProduct(req, res, next) {
        const query = req.query.query;
        Product.findById(query)
            .then(doc => {
                if (doc)
                    res.send({ product: mongooseToObj(doc) });
                else
                    res.send({ message: `Không tìm thấy sản phẩm "${query}"` });
            }).catch(() => {
                Product.find({ $text: { $search: query } })
                    .then(docs => {
                        if (docs && docs.length > 0)
                            res.send({ products: multiMongooseToObjs(docs) });
                        else
                            res.send({ message: `Không tìm thấy sản phẩm với từ khóa "${query}"` });
                    })
            })
    }

    
}

module.exports = new ImportController;