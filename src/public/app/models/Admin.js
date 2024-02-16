const mongoose = require('mongoose');
const PhoneNumber = require('libphonenumber-js');
const softDelete = require('mongoosejs-soft-delete');

const Admin = new mongoose.Schema(
    {
        password: { type: String, require: true, },
        initPassword: { type: String, },
        fullName: { type: String, default: function () { return this.username; } },
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
        isAdmin: { type: Boolean, },
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

Admin.plugin(softDelete);

module.exports = mongoose.model('Admin', Admin);
