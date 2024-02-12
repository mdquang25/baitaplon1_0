const admin = require('firebase-admin');

const serviceAccount = require('./baitaplon1-96fcf-firebase-adminsdk-uw5m0-1d65dd3e0a.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'baitaplon1-96fcf.appspot.com'
});

module.exports = admin;