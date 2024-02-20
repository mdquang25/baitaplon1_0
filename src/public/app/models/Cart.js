const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');


const Cart = new mongoose.Schema(
    {
        productQ_id: [{ type: String, }],
        order_id: [{ type: String, }],
        newProduct: { type: Boolean, },
        newOrderUpdate: { type: Boolean, },
    },
    {
        timestamps: true,
    },
);

Cart.plugin(softDelete);

module.exports = mongoose.model('Cart', Cart);
