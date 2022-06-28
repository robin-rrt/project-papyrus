'use strict';
const dotenv = require('dotenv');
const { credential } = require('firebase-admin');
var serviceAccount = require("./keys/serviceAccountKey.json");

dotenv.config();

const {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
} = process.env;


module.exports = {
    firebaseConfig: {
        apiKey: apiKey,
        authDomain: authDomain,
        databaseURL: databaseURL,
        projectId: projectId,
        storageBucket: storageBucket,
        messagingSenderId: messagingSenderId,
        appId: appId,
        credential: credential.cert(serviceAccount)
    }
}