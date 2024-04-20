const { multiMongooseToObjs, mongooseToObj } = require("../../../../util/mongoose");
const Baiviet = require("../../models/Baiviet");
const Carousel = require("../../models/Carousel");



class BaivietController {
    index(req, res, next) {
        Promise.all([Baiviet.find({}), Carousel.find({})])
            .then(([baiviets, carousels]) => {
                res.render('customer/baiviet/list', { pageTitle: 'Bài viết', baiviets: multiMongooseToObjs(baiviets), carousels: multiMongooseToObjs(carousels), });
            }).catch(() => res.redirect('/not-found-404'));
    }

    read(req, res, next) {
        Carousel.find({})
            .then(carousels => {
                Baiviet.findOne({ slug: req.params.slug })
                    .then(doc => {
                        if (doc) {
                            res.render('customer/baiviet/read', { pageTitle: doc.name, baiviet: mongooseToObj(doc), carousels: multiMongooseToObjs(carousels), });
                        } else {
                            res.redirect('/not-found-404');
                        }
                    }).catch(() => res.redirect('/not-found-404'));
            }).catch(next);
    }

    viewed(req, res, next) {
        console.log('viewed baiviet - admin');
        Baiviet.findById(req.params.id)
            .then(doc => {
                if (doc) {
                    doc.views++;
                    doc.save();
                    res.status(200);
            }
        })
    }
}

module.exports = new BaivietController; 