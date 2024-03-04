require('firebase/auth');
const admin = require('../config/firebaseAdmin');

const auth = admin.auth();

auth.languageCode = 'it';

module.exports = auth;