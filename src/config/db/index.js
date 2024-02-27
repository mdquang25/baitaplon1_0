const mongoose = require('mongoose');

async function connect() {
    try {
        //await mongoose.connect('mongodb://localhost:27017/baitaplon1_db_dev');
        await mongoose.connect('mongodb+srv://mdquang25_mongodb:ENA7RghS0Q2yfL0J@cluster0.twexh1b.mongodb.net/baitaplon1_db_dev?retryWrites=true&w=majority');
        //await mongoose.connect('mongodb://mongo:hEfAee3Cg-FeeD2HcafE45FDHFaaGB-d@monorail.proxy.rlwy.net:40488');
        //await mongoose.connect('mongodb://mongo:hEfAee3Cg-FeeD2HcafE45FDHFaaGB-d@mongodb-uhyx.railway.internal:27017');
        console.log('connect successfully!');
    } catch (error) {
        console.log('failed to connect to database!');
    }
}

module.exports = { connect };
