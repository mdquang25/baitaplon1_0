const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');


const Order = new mongoose.Schema(
    {
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
        },
        productQ_ids: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductQ',
         }],
        cod: { type: Boolean, },
        ship: { type: Boolean, },
        reciever: { type: String, },
        address: { type: String, },
        phoneNumber: { type: String, },
        message: { type: String, },
        status: { type: Number, },
        productFee: { type: mongoose.Types.Decimal128, default: 0, },
        shippingFee: { type: mongoose.Types.Decimal128, default: 0, },
        total: { type: mongoose.Types.Decimal128, default: 0, },
        qrcodeUrl: { type: String, },
        paid: { type: Boolean, },
    },
    {
        timestamps: true,
    },
);

Order.plugin(softDelete);

module.exports = mongoose.model('Order', Order);
