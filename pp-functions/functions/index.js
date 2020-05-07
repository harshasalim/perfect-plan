const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllPlans, postOnePlan, getPlan, deletePlan, commentOnPlan, likePlan, unlikePlan } = require('./handlers/plans');
const { signUp, logIn, uploadImage, addUserDetails, getAuthenticatedUsers } = require('./handlers/users');

//Plan Routes
app.get('/plans', getAllPlans);
app.post('/plans', FBAuth, postOnePlan);
app.get('/plan/:planId', getPlan);
app.delete('/plan/:planId', FBAuth, deletePlan);
app.post('/plan/:planId/comment', FBAuth, commentOnPlan);
app.get('/plan/:planId/like', FBAuth, likePlan);
app.get('/plan/:planId/unlike', FBAuth, unlikePlan);

//Users Routes
app.post('/signup', signUp);
app.post('/login', logIn);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user',FBAuth, getAuthenticatedUsers);


exports.api = functions.region("asia-east2").https.onRequest(app);

