const ShopInfo = require('../../public/app/models/ShopInfo');

const getShopInfo = (req, res, next) => {
    if (req.session.user) {
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
            }).catch(next);
    }
    else
        next();
};

module.exports = getShopInfo;