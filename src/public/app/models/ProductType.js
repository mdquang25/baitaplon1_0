const mongoose = require('mongoose');
const slug = require('mongoose-slug-plugin');

const Type = new mongoose.Schema(
    {
        name: { type: String, require: true, },
        description: { type: String, },
        productCount: { type: Number, default: 0, },
        imageUrl: { type: String, }, 
        categoryId: { type: String, required: true, },
        slug: { type: String, unique: true },
    },
    {
        timestamps: true,
    },
);

Type.plugin(slug, { tmpl: '<%=name%>' });

module.exports = mongoose.model('Type', Type);
