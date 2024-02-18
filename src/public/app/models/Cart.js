const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');


const Cart = new mongoose.Schema(
    {
        
    },
    {
        timestamps: true,
    },
);

Cart.plugin(softDelete);

module.exports = mongoose.model('Cart', Cart);
