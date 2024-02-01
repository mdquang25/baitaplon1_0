const adminAccountRouter = require('./admin/account.js');
const adminKhoRouter = require('./admin/kho');
const adminSiteRouter = require('./admin/site');
const customerSiteRouter = require('./customer/site');

function router(app) {
    app.use('/admin/taikhoancuatoi', adminAccountRouter);
    app.use('/admin/kho', adminKhoRouter);
    app.use('/admin', adminSiteRouter);
    app.use('/', customerSiteRouter);
}

module.exports = router;
