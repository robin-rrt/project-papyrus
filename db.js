const firebase = require('firebase-admin');
const config = require('./config');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
require('firebase/auth');
require('firebase/database');
const { getStorage } = require('firebase-admin/storage');



const db = firebase.initializeApp(config.firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const bucket = getStorage().bucket();

module.exports = {
                    db,
                  bucket
                };