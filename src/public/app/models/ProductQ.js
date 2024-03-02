const mongoose = require('mongoose');

const ProductQ = new mongoose.Schema(
    {
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        productName: { type: String, },
        imageUrl: { type: String, },
        productSlug: { type: String, },
        price: { type: mongoose.Types.Decimal128, default: 0, },
        total: { type: mongoose.Types.Decimal128, default: 0, },
        quantity: { type: Number, required: true, },

    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('ProductQ', ProductQ);
