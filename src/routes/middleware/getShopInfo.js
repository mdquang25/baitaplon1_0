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
                        linkFacebook: 'https://www.facebook.com/profile.php?id=100009440423560',
                        linkZalo: 'https://zaloapp.com/qr/p/p7py361sf5re',
                        linkYoutube: 'https://www.youtube.com/@mdquang25mq35',
                        linkGoogleMap: 'https://maps.app.goo.gl/bz4kmtWGHyBNd26x5',
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