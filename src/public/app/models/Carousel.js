const mongoose = require('mongoose');
const slug = require('mongoose-slug-plugin');



const Carousel = new mongoose.Schema(
    {
        title: { type: String, require: true },
        description: { type: String },
        imageUrl: { type: String, require: true },
        link: { type: String, },
        slug: { type: String, unique: true },
    },
    {
        timestamps: true,
    },
);

Carousel.plugin(slug, { tmpl: '<%=title%>' });

module.exports = mongoose.model('Carousel', Carousel);
