const mongoose = require('mongoose');

async function connect() {
    try {
        //await mongoose.connect('mongodb://mongo:a5gA1F34E-bEcA-42AbEC2hDFHdba3Bh@viaduct.proxy.rlwy.net:58783');///*'mongodb://localhost:27017/baitaplon1_db_dev');*/'mongodb+srv://mdquang25_mongodb:ENA7RghS0Q2yfL0J@cluster0.twexh1b.mongodb.net/baitaplon1_db_dev?retryWrites=true&w=majority');
        await mongoose.connect('mongodb://mongo:a5gA1F34E-bEcA-42AbEC2hDFHdba3Bh@mongodb.railway.internal:27017');
        console.log('connect successfully!');
    } catch (error) {
        console.log('failed to connect to database!');
    }
}

module.exports = { connect };
