const mongoose = require('mongoose');
const slug = require('mongoose-slug-plugin');

const Category = new mongoose.Schema(
    {
        name: { type: String, require: true },
        description: { type: String },
        slug: { type: String, unique: true },
        typesIds: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductType',
        }
    },
    {
        timestamps: true,
    },
);
Category.plugin(slug, { tmpl: '<%=name%>' });

module.exports = mongoose.model('Category', Category);
