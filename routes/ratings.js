var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');

var Movies = require('../models/Movies');

router.put('/add/:id', checkToken, function(req, res) {
    if(req.body) {
        var rating = req.body;
        Movies.update({_id: req.params.id}, {$push: {'ratings': {$each: [rating], $position: 0}}}, function(err, doc) {
            if(err) {
                res.send({error: true, message: err});
            }else {
                Movies.findOne({_id: req.params.id}).populate('ratings.userId').exec(function(err, doc) {
                    res.json({error: false, res: doc});
                })
            }
        })
    }
});

router.put('/update/:id', checkToken, function(req, res) {
    if(req.body) {
        var rating = req.body;
        Movies.update({_id: req.params.id, 'ratings.userId': req.body.userId}, {$set: {'ratings.$.rating': rating.rating, 'ratings.$.review': rating.review}}, function(err, doc) {
            if(err) {
                res.send({error: true, message: err});
            }else {
                Movies.findOne({_id: req.params.id}).populate('ratings.userId').exec(function(err, doc) {
                    res.json({error: false, res: doc});
                })
            }
        });
    }
});

module.exports = router;