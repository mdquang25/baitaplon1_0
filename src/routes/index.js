const employeeAccountsRouter = require('./admin/employee-accounts');
const adminAccountRouter = require('./admin/account');
const adminCustomersRouter = require('./admin/customers');
const shopInfoRouter = require('./admin/shop-info');
const adminKhoRouter = require('./admin/kho');
const adminBaivietRouter = require('./admin/baiviet');
const adminOrdersRouter = require('./admin/orders');
const adminStatisticRouter = require('./admin/statistic');
const adminSiteRouter = require('./admin/site');
const customerSiteRouter = require('./customer/site');
const customerSurfRouter = require('./customer/surf');
const customerCartRouter = require('./customer/cart');
const customerAccountRouter = require('./customer/account');

function router(app) {
    app.use('/admin/taikhoan-nhanvien', employeeAccountsRouter);
    app.use('/admin/taikhoancuatoi', adminAccountRouter);
    app.use('/admin/khachhang', adminCustomersRouter);
    app.use('/admin/cuahang', shopInfoRouter);
    app.use('/admin/kho', adminKhoRouter);
    app.use('/admin/baiviet', adminBaivietRouter);
    app.use('/admin/donhang', adminOrdersRouter);
    app.use('/admin/thongke', adminStatisticRouter);
    app.use('/admin', adminSiteRouter);
    app.use('/sanpham', customerSurfRouter);
    app.use('/giohang', customerCartRouter);
    app.use('/taikhoan', customerAccountRouter);
    app.use('/', customerSiteRouter);
}

module.exports = router;
