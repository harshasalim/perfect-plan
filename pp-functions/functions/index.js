const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { db }= require('./util/admin');

const { getAllPlans, postOnePlan, getPlan, deletePlan, commentOnPlan, likePlan, unlikePlan } = require('./handlers/plans');
const { signUp, logIn, uploadImage, addUserDetails, getAuthenticatedUsers, getUserDetails, markNotificationsRead } = require('./handlers/users');

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
app.get('/user/:handle', getUserDetails);
app.post('/notifications',FBAuth, markNotificationsRead);

exports.api = functions.region("asia-east2").https.onRequest(app);

exports.createNotificationOnLike = functions.region("asia-east2").firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/plans/${snapshot.data().planId}`).get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender:snapshot.data().userHandle,
                        read:false,
                        type:'like',
                        planId: doc.id
                    });
                }
            })
            .catch(err=> 
                console.error(err));
            
    })

//delete a notification when someone unlikes a plan
exports.deleteNotificationOnUnlike = functions.region("asia-east2").firestore.document('likes/{id}')
.onDelete((snapshot) =>{
    return db.doc(`/notifications/${snapshot.id}`)
        .delete()
        .catch(err => 
            console.error(err));
})

exports.createNotificationOnComment = functions.region("asia-east2").firestore.document('comments/{id}')
    .onCreate((snapshot) =>{
        return db.doc(`/plans/${snapshot.data().planId}`).get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender:snapshot.data().userHandle,
                        read:false,
                        type:'comment',
                        planId: doc.id
                    });
                }
            })
            .catch(err=> 
                console.error(err));
    });

exports.onUserImageChange = functions.region("asia-east2").firestore.document('/users/{userId}')
        .onUpdate((change) => {
            console.log(change.before.data());
            console.log(change.after.data());
            if(change.before.data().imageUrl !== change.after.data().imageUrl){
                console.log("Image has changed");
                const batch = db.batch();
                return db.collection('plans').where('userHandle','==',change.before.data().handle).get()
                .then((data) =>{
                    data.forEach(doc => {
                        const plan = db.doc(`/plans/${doc.id}`);
                        batch.update(plan, { userImage: change.after.data().imageUrl});
                    });
                    return batch.commit();
                });
            } else return true;
        });

exports.onPlanDelete = functions.region("asia-east2").firestore.document('/plans/{planId}')
    .onDelete((snapshot, context) => {
        const planId= context.params.planId;
        const batch = db.batch();
        return db.collection('comments').where('planId','==',planId).get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('likes').where('planId','==',planId).get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications').where('planId','==',planId).get()
                
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch(err => console.error(err));
    })