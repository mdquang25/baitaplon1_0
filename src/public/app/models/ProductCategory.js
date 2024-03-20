const mongoose = require('mongoose');
const slug = require('mongoose-slug-plugin');

const Category = new mongoose.Schema(
    {
        name: { type: String, require: true },
        description: { type: String },
        slug: { type: String, unique: true },
        typesIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductType',
        }]
    },
    {
        timestamps: true,
    },
);

//custom function
Category.query.sortList = function (req) {
    if (req.query.hasOwnProperty('sort')) {
        const isValidType = ['asc', 'desc'].includes(req.query.type);
        return this.sort({ [req.query.field]: isValidType ? req.query.type : 'asc', });
    }
    return this;
}

Category.plugin(slug, { tmpl: '<%=name%>' });

module.exports = mongoose.model('Category', Category);
