const employeeAccountsRouter = require('./admin/employee-accounts');
const adminAccountRouter = require('./admin/account');
const adminKhoRouter = require('./admin/kho');
const adminSiteRouter = require('./admin/site');
const customerSiteRouter = require('./customer/site');
const customerProductRouter = require('./customer/product');

function router(app) {
    app.use('/admin/taikhoan-nhanvien', employeeAccountsRouter);
    app.use('/admin/taikhoancuatoi', adminAccountRouter);
    app.use('/admin/kho', adminKhoRouter);
    app.use('/admin', adminSiteRouter);
    app.use('/sanpham', customerProductRouter);
    app.use('/', customerSiteRouter);
}

module.exports = router;
