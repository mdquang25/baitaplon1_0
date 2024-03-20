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
//custom function
ImportBill.query.sortList = function (req) {
    if (req.query.hasOwnProperty('sort')) {
        const isValidType = ['asc', 'desc'].includes(req.query.type);
        return this.sort({ [req.query.field]: isValidType ? req.query.type : 'asc', });
    }
    return this;
}
ImportBill.plugin(softDelete);

module.exports = mongoose.model('ImportBill', ImportBill);
