const mongoose = require('mongoose');
const slug = require('mongoose-slug-plugin');

const Category = new mongoose.Schema(
    {
        name: { type: String, require: true },
        description: { type: String },
        typeCount: { type: Number, default: 0, },
        slug: { type: String, unique: true },
    },
    {
        timestamps: true,
    },
);
Category.plugin(slug, { tmpl: '<%=name%>' });

module.exports = mongoose.model('Category', Category);
