const firebase = require('firebase-admin');
const config = require('./config');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
require('firebase/auth');
require('firebase/database');


const db = firebase.initializeApp(config.firebaseConfig);

module.exports = db;