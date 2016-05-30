var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');

var Movies = require('../models/Movies');

router.post('/add', checkToken, function(req, res) {
    if(req.body) {
        var movie = new Movies(req.body);

        movie.save(function(err, doc) {
            if(err) {
                res.json({error: true, res: err});
            }else {
                res.json({error: false, res: doc});
            }
        })
    }
});

router.get('/', checkToken, function(req, res) {
    Movies.find({}, function(err, docs) {
        if(err) {
            res.json({error: true, res: err});
        }else {
            res.json({error: false, res: docs});
        }
    })
})

router.delete('/:id', checkToken, function(req, res) {
    Movies.find({_id: req.params.id}).remove(function(err, docs) {
        if(err) {
            res.json({error: true, res: err});
        }else if(docs.result.n){
            res.json({error: false});
        }else{
            res.json({error: true, res: {message: 'NO_MOVIE_FOUND'}});
        }
    });
});

router.get('/:id', function(req, res) {
    Movies.findOne({_id: req.params.id}).populate('ratings.userId', 'username').exec(function(err, doc) {
        if(err) {
            res.json({error: true, res: err});
        }else{
            res.json({error: false, res: doc});
        }
    });
});

router.put('/:id', function(req, res) {
    if(req.body) {
        Movies.update({_id: req.params.id}, req.body, function(err, docs) {
            if(err) {
                res.json({error: true, res: err});
            }else{
                res.json({error: false, success: true});
            }
        });
    }
})

router.post('/latest', function(req, res) {
    Movies.find({}).sort({timestamp: '-1'}).limit(10).exec(function(err, docs) {
        if(err) {
            res.json({error: true, res: err});
        }else{
            res.json({error: false, res: docs});
        }
    });
})

router.post('/best', function(req, res) {
    Movies.find({}).limit(10).exec(function(err, docs) {
        if(err) {
            res.json({error: true, res: err});
        }else{
            function getRating(ratings) {
                var sum = 0
                for (var i = ratings.length - 1; i >= 0; i--) {
                    sum += +ratings[i].rating;
                }
                return Math.round((sum/ratings.length)*2)/2;
            }
            docs.sort(function(a, b) {
                return getRating(b.ratings) - getRating(a.ratings);
            });
            res.json({error: false, res: docs.slice(0, 10)});
        }
    });
})

module.exports = router;