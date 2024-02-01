const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete')


const Carousel = new mongoose.Schema(
    {
        title: { type: String, require: true },
        description: { type: String },
        image: { type: String, require: true },
        slug: { type: String, unique: true },
    },
    {
        timestamps: true,
    },
);

Carousel.plugin(softDelete);

module.exports = mongoose.model('Carousel', Carousel);
