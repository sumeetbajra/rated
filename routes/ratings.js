var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');

var Ratings = require('../models/Ratings');

router.post('/add', checkToken, function(req, res) {
    if(req.body) {
        var ratings = new Ratings(req.body);
        ratings.save(function(err, doc){
            if(err) {
                res.send({error: true, message: err});
            }else {
                res.json({error: false, res: doc});
            }
        })
    }
});

module.exports = router;