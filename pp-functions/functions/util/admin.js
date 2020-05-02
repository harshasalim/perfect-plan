const admin = require('firebase-admin');
var serviceAccount = require('../keys/admin.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://perfect-plan-a0e83.firebaseio.com"
});

const db = admin.firestore();

module.exports= {admin, db};