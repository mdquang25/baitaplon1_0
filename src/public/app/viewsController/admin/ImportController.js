const { mongooseToObj, multiMongooseToObjs } = require("../../../../util/mongoose");
const ImportBill = require("../../models/ImportBill");
const Import = require("../../models/ImportBill");
const Product = require("../../models/Product");
const ProductQ = require("../../models/ProductQ");



class ImportController {
    import(req, res) {
        res.render('admin/product/import', { pageTitle: 'Nhập hàng', layout: 'admin', manager: req.session.manager, isAdmin: req.session.isAdmin, })
    }

    //[GET] /admin/kho/nhaphang/lichsu?print=
    history(req, res, next) {
        const printId = req.query.print;
        ImportBill.find({})
            .then(importBills => {
                res.render('admin/product/import-history', { pageTitle: 'Lịch sử nhập hàng', layout: 'admin', isAdmin: req.session.isAdmin, importBills: multiMongooseToObjs(importBills), printId })
            })

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

    //[POST] /admin/nhaphang/luu-phieu-nhap
    saveImport(req, res, next) {
        console.log('save import bill - admin');
        var total = 0;
        const productQIdsPromises = req.body.productIds.map(productId => {
            return Product.findById(productId)
                .then(product => {
                    const quantity = parseInt(req.body[`${productId}quantity`]);
                    total += quantity;
                    product.stock += quantity;
                    product.count += quantity;
                    const productQ = new ProductQ({
                        productId: productId,
                        productName: product.name,
                        imageUrl: product.imagesUrls[product.mainImageIndex],
                        productSlug: product.slug,
                        price: product.price,
                        quantity,
                    });
                    productQ.save();
                    product.save();
                    return productQ._id;
                });
        });
        Promise.all(productQIdsPromises)
            .then(productQ_ids => {
                const importBill = new ImportBill({
                    Admin_id: req.session.manager.id,
                    managerName: req.session.manager.fullName,
                    productQ_ids,
                    note: req.body.note,
                    total,
                });
                importBill.save();
                if (req.body.print === 'true')
                    res.redirect('/admin/kho/nhaphang/lichsu?print=' + importBill._id);
                else
                    res.redirect('/admin/kho/nhaphang/lichsu');
            })
    }

    //[GET] /admin/kho/nhaphang/lichsu/:id
    importDetails(req, res, next) {
        ImportBill.findById(req.params.id)
            .then(doc => {
                ProductQ.find({ _id: { $in: doc.productQ_ids } })
                    .then(productQs => {
                        res.render('admin/product/import-details', { pageTitle: 'Chi tiết phiếu nhập hàng', layout: 'admin', isAdmin: req.session.isAdmin, importBill: mongooseToObj(doc), productQs: multiMongooseToObjs(productQs), })
                    })
            })
    }
    //[GET] /admin/kho/nhaphang/lichsu/:id/in-phieu
    printImportBill(req, res, next) {
        ImportBill.findById(req.params.id)
            .then(doc => {
                ProductQ.find({ _id: { $in: doc.productQ_ids } })
                    .then(productQs => {
                        res.render('admin/product/import-details-print', { pageTitle: 'In phiếu nhập hàng', layout: 'print', shopInfo: res.locals.shopInfo, importBill: mongooseToObj(doc), productQs: multiMongooseToObjs(productQs), })
                    })
            }).catch(() => res.redirect('/not-found-404'));
    }
}

module.exports = new ImportController;