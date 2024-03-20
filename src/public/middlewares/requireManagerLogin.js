const requireManagerLogin = (req, res, next) => {
    if (!req.session.manager) {
        return res.redirect('/admin/dangnhap');
    }
    next();
};
module.exports = requireManagerLogin;