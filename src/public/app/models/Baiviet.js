const mongoose = require('mongoose');
const slug = require('mongoose-slug-plugin');
const softDelete = require('mongoosejs-soft-delete');


const Baiviet = new mongoose.Schema(
    {
        name: { type: String, require: true },
        author: { type: String, require: true, },
        description: { type: String },
        imagesUrls: [{ type: String, }],
        mainImageIndex: { type: Number, default: 0, },
        content: { type: String, },
        views: { type: Number, default: 0, },
        slug: { type: String, unique: true },
    },
    {
        timestamps: true,
    },
);

Baiviet.index({ name: 'text' });
Baiviet.plugin(slug, { tmpl: '<%=name%>' });
Baiviet.plugin(softDelete);

module.exports = mongoose.model('Baiviet', Baiviet);
