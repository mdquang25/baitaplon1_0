const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Create a new MongoDBStore instance
const store = new MongoDBStore({
    //uri: 'mongodb://mongo:a5gA1F34E-bEcA-42AbEC2hDFHdba3Bh@viaduct.proxy.rlwy.net:58783',// 'mongodb+srv://mdquang25_mongodb:ENA7RghS0Q2yfL0J@cluster0.twexh1b.mongodb.net/baitaplon1_db_dev?retryWrites=true&w=majority',
    uri: 'mongodb://mongo:a5gA1F34E-bEcA-42AbEC2hDFHdba3Bh@mongodb.railway.internal:27017',
    collection: 'sessions' // The collection where sessions will be stored
});

// Catch errors in the MongoDBStore
store.on('error', function (error) {
    console.error('MongoDB session store error(mdq25):', error);
});

// Configure the session middleware
module.exports = session({
    secret: 'gTTFVAzZSl6im$O',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // Session expiration time (e.g., 1 day)
    }
});