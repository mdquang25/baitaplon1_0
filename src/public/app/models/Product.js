const mongoose = require('mongoose');
const slug = require('mongoose-slug-plugin');
const softDelete = require('mongoosejs-soft-delete');


const Product = new mongoose.Schema(
    {
        name: { type: String, require: true },
        description: { type: String },
        onSale: { type: Boolean, default: false },
        oldPrice: { type: mongoose.Types.Decimal128, default: 0, },
        price: { type: mongoose.Types.Decimal128, default: 0, },
        stock: { type: Number, default: 0, },
        count: { type: Number, default: function () { return this.stock; }, },
        sold: { type: Number, default: 0, },
        imagesUrls: [{ type: String, }],
        mainImageIndex: { type: Number, default: 0, },
        typesIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductType',
        }],
        slug: { type: String, unique: true },
    },
    {
        timestamps: true,
    },
);

//custom function
Product.query.sortList = function (req) {
    if (req.query.hasOwnProperty('sort')) {
        const isValidType = ['asc', 'desc'].includes(req.query.type);
        return this.sort({ [req.query.field]: isValidType? req.query.type : 'asc', });
    }
    return this;
}
Product.index({ name: 'text' });
Product.plugin(slug, { tmpl: '<%=name%>' });
Product.plugin(softDelete);

module.exports = mongoose.model('Product', Product);
