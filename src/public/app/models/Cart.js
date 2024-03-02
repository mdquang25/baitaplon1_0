const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');


const Cart = new mongoose.Schema(
    {
        productQ_ids: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductQ',
        }],
        order_ids: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
         }],
        newProduct: { type: Boolean, },
        newOrderUpdate: { type: Boolean, },
    },
    {
        timestamps: true,
    },
);

Cart.plugin(softDelete);

module.exports = mongoose.model('Cart', Cart);
