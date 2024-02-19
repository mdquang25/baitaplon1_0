const mongoose = require('mongoose');


const ShopInfo = new mongoose.Schema(
    {
        shortName: { type: String, },
        fullName: { type: String, },
        address: { type: String, },
        linkFacebook: { type: String, },
        linkZalo: { type: String, },
        linkYoutube: { type: String, },
        linkGoogleMap: { type: String, },
        
        
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('ShopInfo', ShopInfo);
