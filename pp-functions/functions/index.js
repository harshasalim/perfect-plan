const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllPlans, postOnePlan } = require('./handlers/plans');
const { signUp, logIn, uploadImage } = require('./handlers/users');

//Plan Routes
app.get('/plans', getAllPlans);
app.post('/plans', FBAuth, postOnePlan); 

//Users Routes
app.post('/signup', signUp);
app.post('/login', logIn);
app.post('/user/image', FBAuth, uploadImage);


exports.api = functions.region("asia-east2").https.onRequest(app);

