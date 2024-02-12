// // Import the functions you need from the SDKs you need
// const firebase = require('firebase/app');
const admin = require('../config/firebaseAdmin');
require('firebase-admin/storage');

const bucket = admin.storage().bucket();

module.exports = bucket;
// 'bucket' is an object defined in the @google-cloud/storage library.
// See https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/latest/storage/bucket
// for more details.