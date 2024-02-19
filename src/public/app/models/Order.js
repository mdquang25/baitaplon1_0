const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');


const Order = new mongoose.Schema(
    {
        productQ_id: [{ type: String, }],
                
    },
    {
        timestamps: true,
    },
);

Order.plugin(softDelete);

module.exports = mongoose.model('Order', Order);
