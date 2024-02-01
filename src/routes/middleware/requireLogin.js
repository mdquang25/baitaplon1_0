const requireLogin = (req, res, next) => {
    if (!req.session.isLoggedin) {
        return res.redirect('/dangnhap');
    }
    next();
};
module.exports = requireLogin;