const Cart = require('../app/models/Cart');
const ShopInfo = require('../app/models/ShopInfo');

const userHeaderObjects = (req, res, next) => {
    console.log('userHeaderObjects');
    ShopInfo.findOne({})
        .then(doc => {
            if (doc) {
                res.locals.shopInfo = doc.toObject();
            }
            else {
                res.locals.shopInfo = {
                    shortName: 'Việt Tuấn Trung',
                    fullName: 'Cửa hàng đồ gỗ cổ Việt Tuấn Trung',
                    phoneNumber: 'unknown',
                    address: 'unknown',
                    shippingFee: 30000,
                    linkFacebook: 'unknown',
                    linkZalo: 'unknown',
                    linkYoutube: 'unknown',
                    linkGoogleMap: 'unknown',
                    description: 'sản phẩm: bàn, ghế gỗ, tượng gỗ, bàn thờ, tượng nhỏ, bình hoa, những vật trang trí điêu khắc từ gỗ',
                }
            }
            if (req.session.user) {
                Cart.findOne({ _id: req.session.user.cartId })
                    .then(doc => {
                        if (doc) {
                            const cart = {
                                newProduct: doc.newProduct,
                                newOrderUpdate: doc.newOrderUpdate,
                            }
                            res.locals.cart = cart;
                        }
                        next();
                    }).catch(next);
            }
            else
                next();
        }).catch(next);
}

module.exports = userHeaderObjects;