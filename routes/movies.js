var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');
var formatFormErrorMessage = require('../utils/formatFormErrorMessage');

var Movies = require('../models/Movies');

router.post('/add', checkToken, function(req, res) {
    if(req.body) {
        var movie = new Movies(req.body);

        movie.save(function(err, doc) {
            if(err) {
                res.json({error: true, res: formatFormErrorMessage(err)});
            }else {
                Movies.findOne({_id: doc._id}).populate('ratings.userId').populate('cast.celebrityId').populate('category.categoryId').populate('director.celebrityId').exec(function(err, doc) {
                    res.json({error: false, res: doc});
                });
            }
        })
    }
});

router.get('/all/:page', checkToken, function(req, res) {
    Movies.paginate({}, {page: req.params.page, limit: 5, sort: {_id: '-1'}, populate: ['cast.celebrityId', 'director.celebrityId', 'category.categoryId']}).then(function(docs) {
        res.json({error: false, res: docs});
    })
});

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
    Movies.findOne({_id: req.params.id}).populate('ratings.userId').populate('cast.celebrityId').populate('category.categoryId').populate('director.celebrityId').exec(function(err, doc) {
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
});

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
            docs.sort(function(a, b) {
                return b.overallRating - a.overallRating;
            });
            res.json({error: false, res: docs.slice(0, 10)});
        }
    });
});

router.get('/search/:q', function(req, res) {
    Movies.find({title: {$regex: "^" + req.params.q, $options: 'i'}}).select('title year cast posterUrl').populate('cast.celebrityId', 'fullName')
    .limit(5)
    .exec(function(err, docs) {
        res.json(docs);
    });
})

module.exports = router;
