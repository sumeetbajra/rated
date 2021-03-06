var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');

var Movies = require('../models/Movies');

router.put('/add/:id', function(req, res) {
    if(req.body) {
        var rating = req.body;
        Movies.findOne({_id: req.params.id}, function(err, doc) {
            var oldRating = doc.overallRating;
            var newRating = ((oldRating * doc.ratings.length) + parseFloat(rating.rating)) / (doc.ratings.length + 1);
            Movies.update({_id: req.params.id}, {overallRating: newRating, ratingsCount: doc.ratings.length + 1, $push: {'ratings': {$each: [rating], $position: 0}}}, function(err, doc) {
                if(err) {
                    res.send({error: true, message: err});
                }else {
                    Movies.findOne({_id: req.params.id}).populate('ratings.userId').populate('cast.celebrityId').populate('director.celebrityId').exec(function(err, doc) {
                        res.json({error: false, res: doc});
                    })
                }
            })
        });
        // Movies.update({_id: req.params.id}, {$push: {'ratings': {$each: [rating], $position: 0}}}, function(err, doc) {
        //     if(err) {
        //         res.send({error: true, message: err});
        //     }else {
        //         Movies.findOne({_id: req.params.id}).populate('ratings.userId').populate('cast.celebrityId').populate('director.celebrityId').exec(function(err, doc) {
        //             res.json({error: false, res: doc});
        //         })
        //     }
        // })
    }
});

router.put('/update/:id', checkToken, function(req, res) {
    if(req.body) {
        var rating = req.body;
        Movies.update({_id: req.params.id, 'ratings.userId': req.body.userId}, {$set: {'ratings.$.rating': rating.rating, 'ratings.$.review': rating.review}}, function(err, doc) {
            if(err) {
                res.send({error: true, message: err});
            }else {
                Movies.findOne({_id: req.params.id}).populate('ratings.userId').populate('cast.celebrityId').populate('director.celebrityId').exec(function(err, doc) {
                    res.json({error: false, res: doc});
                })
            }
        });
    }
});

module.exports = router;