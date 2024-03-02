const Cart = require('../../public/app/models/Cart');
const ShopInfo = require('../../public/app/models/ShopInfo');

const userHeaderObjects = (req, res, next) => {
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
                        next();
                })
            }).catch(next);
    }
    else
        next();
};

module.exports = userHeaderObjects;