const requireAdminLogin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.redirect('/admin/dangnhap');
    }
    next();
};
module.exports = requireAdminLogin;