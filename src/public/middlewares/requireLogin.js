const requireLogin = (req, res, next) => {
    if (!req.session.isLoggedin) {
        //res.send({requireLogin: true});
        res.redirect('/dangnhap');
    }
    else
        next();
};
module.exports = requireLogin;