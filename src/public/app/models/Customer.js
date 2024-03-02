const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');
const PhoneNumber = require('libphonenumber-js');

const Customer = new mongoose.Schema(
    {
        password: { type: String, require: true, },
        fullName: { type: String, default: "unknown" },
        dateOfBirth: { type: String, },
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
        address: { type: String, },
        cartId: { type: String, },
    },
    {
        timestamps: true,
    },
);
Customer.pre('save', function (next) {
    if (this.phoneNumber) {
        const parsedNumber = PhoneNumber.parsePhoneNumberFromString(this.phoneNumber, 'VN');
        if (parsedNumber && parsedNumber.isValid()) {
            this.phoneNumber = parsedNumber;
        }
    }
    next();
});
Customer.plugin(softDelete);

module.exports = mongoose.model('Customer', Customer);
