const ShopInfo = require('../app/models/ShopInfo');
const Cart = require('../app/models/Cart');

const getSessionInfo = (req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.manager = req.session.manager;
    res.locals.isAdmin = req.session.isAdmin;
    next();
}

module.exports = getSessionInfo;