const mongoose = require('mongoose');
const PhoneNumber = require('libphonenumber-js');

const ShopInfo = new mongoose.Schema(
    {
        shortName: { type: String, },
        fullName: { type: String, },
        address: { type: String, },
        shippingFee: { type: Number, },
        phoneNumber: {
            type: String,
            validate: {
                validator: (value) => {
                    const parsedNumber = PhoneNumber.parsePhoneNumberFromString(value, 'VN');
                    return parsedNumber && parsedNumber.isValid();
                },
                message: 'Invalid phone number'
            }
        },
        linkFacebook: { type: String, },
        linkZalo: { type: String, },
        linkYoutube: { type: String, },
        linkGoogleMap: { type: String, },
        description: { type: String, },
    },
    {
        timestamps: true,
    },
);

ShopInfo.pre('save', function (next) {
    if (this.phoneNumber) {
        const parsedNumber = PhoneNumber.parsePhoneNumberFromString(this.phoneNumber, 'VN');
        if (parsedNumber && parsedNumber.isValid()) {
            this.phoneNumber = parsedNumber;
        }
    }
    next();
});
module.exports = mongoose.model('ShopInfo', ShopInfo);
