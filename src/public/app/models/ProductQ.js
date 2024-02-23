const mongoose = require('mongoose');

const ProductQ = new mongoose.Schema(
    {
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
        productSlug: { type: String, reqired: true, },
        quantity: { type: Number, required: true, },

    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('ProductQ', ProductQ);
