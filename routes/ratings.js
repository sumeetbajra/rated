var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');

var Movies = require('../models/Movies');

router.put('/add/:id', checkToken, function(req, res) {
    if(req.body) {
        var rating = req.body;
        Movies.update({_id: req.params.id}, {$push: {'ratings': rating}}, function(err, doc) {
            if(err) {
                res.send({error: true, message: err});
            }else {
                Movies.findOne({_id: req.params.id}).populate('ratings.userId', 'username').exec(function(err, doc) {
                    res.json({error: false, res: doc});
                })
            }
        })
    }
});

module.exports = router;