const mongoose = require('mongoose');



const Carousel = new mongoose.Schema(
    {
        imageUrl: { type: String, require: true },
        link: { type: String, },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Carousel', Carousel);
