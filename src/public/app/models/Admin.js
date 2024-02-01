const mongoose = require('mongoose');
const PhoneNumber = require('libphonenumber-js');

const Admin = new mongoose.Schema(
    {
        username: { type: String, require: true,},
        password: { type: String, require: true,},
        fullName: { type: String, default: function () { return this.username; } },
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
        isAdmin: {type: Boolean, },
    },
    {
        timestamps: true,
    },
);

Admin.pre('save', function (next) {
    if (this.phoneNumber) {
        const parsedNumber = PhoneNumber.parsePhoneNumberFromString(this.phoneNumber, 'VN');
        if (parsedNumber && parsedNumber.isValid()) {
            this.phoneNumber = parsedNumber;
        }
    }
    next();
});

module.exports = mongoose.model('Admin', Admin);
