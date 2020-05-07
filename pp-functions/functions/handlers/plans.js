const { db } = require('../util/admin');

exports.getAllPlans = (req, res) => {
    db.collection('plans').orderBy('createdAt','desc').get()
        .then(data => {
            let plans=[];
            data.forEach(doc => {
                plans.push({
                    planId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount
                });
            });
            return res.json(plans);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
          });
};

exports.postOnePlan = (req, res) => {
    if(req.body.body.trim()===''){
        return res.status(400).json({ body: 'Body must not be empty' });
    }

    const newPlan= {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount:0,
        commentCount:0
    };

    db.collection('plans')
        .add(newPlan)
        .then((doc) => {
            const resPlan = newPlan;
            resPlan.planId = doc.id;
            res.json(resPlan);
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong'});
            console.error(err);
        });
}

exports.getPlan = (req, res) => {
    let planData = {};
    db.doc(`/plans/${req.params.planId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Plan not found' });
            }
            planData = doc.data();
            planData.planId= doc.id;
            return db.collection("comments")
            .orderBy('createdAt','desc')
            .where("planId","==", req.params.planId).get();
        })
        .then(data => {
            planData.comments = [];
            data.forEach(doc => {
                planData.comments.push(doc.data());
            });
            return res.json(planData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.code});
        });
};

//Comment on a plan
exports.commentOnPlan = (req, res) => {
    if(req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty'});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        planId: req.params.planId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/plans/${req.params.planId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Plan not found'});
            }
            return doc.ref.update({ commentCount: doc.data().commentCount+1});
        })
        .then(()=>{
            return db.collection('comments').add(newComment);
        })
        .then(()=>{
            res.json(newComment);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Something went wrong'});
        })
}

exports.likePlan = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle','==',req.user.handle)
        .where('planId','==',req.params.planId).limit(1);

    const planDocument = db.doc(`/plans/${req.params.planId}`);

    let planData;

    planDocument.get()
        .then(doc => {
            if(doc.exists){
                planData = doc.data();
                planData.planId= doc.id;
                return likeDocument.get();
            } else{
                return res.status(404).json({error:'Plan not found'});
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('likes').add({
                    planId: req.params.planId,
                    userHandle:req.user.handle
                })
                .then(() => {
                    planData.likeCount++
                    return planDocument.update({ likeCount: planData.likeCount });
                })
                .then(()=>{
                    return res.json(planData);
                })
            } else {
                return res.status(400).json({ error: 'Plan already liked'});
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: err.code });
        });
};

exports.unlikePlan = (req, res) =>{
    const likeDocument = db.collection('likes').where('userHandle','==',req.user.handle)
    .where('planId','==',req.params.planId).limit(1);

const planDocument = db.doc(`/plans/${req.params.planId}`);

let planData;

planDocument.get()
    .then(doc => {
        if(doc.exists){
            planData = doc.data();
            planData.planId= doc.id;
            return likeDocument.get();
        } else{
            return res.status(404).json({error:'Plan not found'});
        }
    })
    .then(data => {
        if(data.empty){
            return res.status(400).json({ error: 'Plan not liked'});
        } else {
            return db.doc(`/likes/${data.docs[0].id}`).delete()
                .then(()=> {
                    planData.likeCount--;
                    return planDocument.update({ likeCount: planData.likeCount});
                })
                .then(()=> {
                    res.json(planData);
                })
        }
    })
    .catch(err => {
        console.error(err)
        res.status(500).json({ error: err.code });
    }); 
};

exports.deletePlan = (req, res) => {
    const document = db.doc(`/plans/${req.params.planId}`);
    document.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Plan not found' });
            }
            if(doc.data().userHandle !== req.user.handle){
                return res.status(403).json({ error: 'Unauthorized' });
            }
            else {
                return document.delete();
            }
        })
        .then(()=> {
            res.json({ message: 'Plan deleted successfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}