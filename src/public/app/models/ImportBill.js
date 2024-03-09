const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');


const ImportBill = new mongoose.Schema(
    {
        Admin_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
        productQ_ids: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductQ',
        }],
        note: { type: String, },
        managerName: { type: String, },
        total: { type: Number, },
    },
    {
        timestamps: true,
    },
);

ImportBill.plugin(softDelete);

module.exports = mongoose.model('ImportBill', ImportBill);
