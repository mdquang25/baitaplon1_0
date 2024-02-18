const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');


const ProductQ = new mongoose.Schema(
    {
        productId: { type: String, reqired: true, },
        quantity: { type: Number, required: true, },
        
    },
    {
        timestamps: true,
    },
);

ProductQ.plugin(softDelete);

module.exports = mongoose.model('ProductQ', ProductQ);
