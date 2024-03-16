const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');


const Order = new mongoose.Schema(
    {
        cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
        },
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
        orderPhoneNumber: { type: String, },
        orderName: { type: String, },
        message: { type: String, },
        status: { type: Number, },//0: chờ xác nhận; 1: chuẩn bị hàng; 2: chờ giao hàng; 3: đã giao; 4: hoàn thành
        productFee: { type: mongoose.Types.Decimal128, default: 0, },
        shippingFee: { type: mongoose.Types.Decimal128, default: 0, },
        total: { type: mongoose.Types.Decimal128, default: 0, },
        qrcodeUrl: { type: String, },
        bankingMessage: { type: String },
        paid: { type: Boolean, },
    },
    {
        timestamps: true,
    },
);

Order.plugin(softDelete);

module.exports = mongoose.model('Order', Order);
