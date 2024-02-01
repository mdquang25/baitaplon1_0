module.exports = {
    multiMongooseToObjs: function (mongooseArray) {
        return mongooseArray.map((mongoose) => mongoose.toObject());
    },
    mongooseToObj: function (mongoose) {
        return mongoose.toObject();
    },
};
