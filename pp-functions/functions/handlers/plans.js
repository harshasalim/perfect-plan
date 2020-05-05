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
        createdAt: new Date().toISOString()
    };

    db.collection('plans')
        .add(newPlan)
        .then((doc) => {
            res.json({message: `document ${doc.id} created successfully`});
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
            return db.collection('comments').add(newComment);
        })
        .then(()=>{
            res.json(newComment);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong'});
        })
}