const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');
const PhoneNumber = require('libphonenumber-js');

const Customer = new mongoose.Schema(
    {
        username: { type: String, require: true,},
        password: { type: String, require: true,},
        fullName: { type: String, default: function () { return this.username; } },
        phoneNumber: {
            type: String,
            validate: {
                validator: (value) => PhoneNumber.isValid(value, 'VN'),
                message: 'Invalid phone number'
            },
            set: (value) => PhoneNumber.parsePhoneNumberFromString(value, 'VN').format('E.164')
        },
        address: { type: String, },
    },
    {
        timestamps: true,
    },
);

Customer.plugin(softDelete);

module.exports = mongoose.model('Customer', Customer);
