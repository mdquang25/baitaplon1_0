const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');


const Order = new mongoose.Schema(
    {
        cart_id: { type: String, },
        productQ_id: [{ type: String, }],
                
    },
    {
        timestamps: true,
    },
);

Order.plugin(softDelete);

module.exports = mongoose.model('Order', Order);
