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