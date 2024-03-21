const ShopInfo = require('../app/models/ShopInfo');
const Cart = require('../app/models/Cart');

const getSessionInfo = (req, res, next) => {
    console.log('get sessioin info');
    res.locals.user = req.session.user;
    res.locals.isLoggedin = req.session.isLoggedin;
    res.locals.manager = req.session.manager;
    res.locals.isAdmin = req.session.isAdmin;
    next();
}

module.exports = getSessionInfo;