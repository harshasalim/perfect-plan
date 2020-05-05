const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllPlans, postOnePlan, getPlan } = require('./handlers/plans');
const { signUp, logIn, uploadImage, addUserDetails, getAuthenticatedUsers } = require('./handlers/users');

//Plan Routes
app.get('/plans', getAllPlans);
app.post('/plans', FBAuth, postOnePlan);
app.get('/plan/:planId', getPlan);


//Users Routes
app.post('/signup', signUp);
app.post('/login', logIn);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user',FBAuth, getAuthenticatedUsers);


exports.api = functions.region("asia-east2").https.onRequest(app);

