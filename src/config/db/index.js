const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://mongo:gHB236d-H41F2HA32g15fEG-41D6f2ch@viaduct.proxy.rlwy.net:46795');///*'mongodb://localhost:27017/baitaplon1_db_dev');*/'mongodb+srv://mdquang25_mongodb:ENA7RghS0Q2yfL0J@cluster0.twexh1b.mongodb.net/baitaplon1_db_dev?retryWrites=true&w=majority');
        console.log('connect successfully!');
    } catch (error) {
        console.log('failed to connect to database!');
    }
}

module.exports = { connect };
