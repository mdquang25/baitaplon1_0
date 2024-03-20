const requireLogin = (req, res, next) => {
    if (!req.session.isLoggedin) {
        res.send({requireLogin: true});
    }
    else
        next();
};
module.exports = requireLogin;