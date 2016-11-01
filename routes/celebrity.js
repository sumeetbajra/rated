var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');

var Celebrity = require('../models/Celebrity');
var Movies = require('../models/Movies');

router.post('/add', checkToken, function(req, res) {
    if(req.body) {
        var celebrity = new Celebrity(req.body);

        celebrity.save(function(err, doc) {
            if(err) {
                res.json({error: true, res: err});
            }else {
                res.json({error: false, res: doc});
            }
        })
    }
});

router.get('/search/:q', function(req, res) {
	Celebrity.find({fullName: {$regex: "^" + req.params.q, $options: 'i'}})
		.limit(10)
       	.exec(function(err, docs) {
       		res.json(docs);
       	});
});

router.get('/all/:page', checkToken, function(req, res) {
    Celebrity.paginate({}, {page: req.params.page, limit: 10, sort: {_id: '-1'}}, function(err, doc) {
        if(err) {
          res.json({error: true, res: {msg: 'NOT_FOUND'}});
        }else {
          res.json({
              error: false,
              res: doc
          })
        }
    })
});

router.get('/:id', function(req, res) {
    Celebrity.findOne({_id: req.params.id}, function(err, doc) {
        if(err) {
          res.json({error: true, res: {msg: 'NOT_FOUND'}});
        }else {
          res.json({
              error: false,
              res: doc
          })
        }
    })
});

router.get('/movies/rated/:id', function(req, res) {
  Movies.find( {$or: [{'cast.celebrityId': req.params.id}, {'director.celebrityId': req.params.id}]}, function(err, docs) {
    if(err) {
        res.json({error: true, res: {msg: 'NOT_FOUND'}});
      }else {
        docs.sort(function(a, b) {
          return b.overallRating - a.overallRating;
        });
        res.json({
          error: false,
          res: docs
        })
      }      
    })
});

router.get('/movies/:id', function(req, res) {
  Movies.find( {$or: [{'cast.celebrityId': req.params.id}, {'director.celebrityId': req.params.id}]}, function(err, docs) {
    if(err) {
        res.json({error: true, res: {msg: 'NOT_FOUND'}});
      }else {
        res.json({
          error: false,
          res: docs
        })
      }      
    })
});

router.delete('/:id', checkToken, function(req, res) {
    Celebrity.find({_id: req.params.id}).remove(function(err, docs) {
        if(err) {
            res.json({error: true, res: err});
        }else if(docs.result.n){
            res.json({error: false});
        }else{
            res.json({error: true, res: {message: 'NO_CELEBRITY_FOUND'}});
        }
    });
});

router.put('/:id', checkToken, function(req, res) {
    if(req.body) {
        Celebrity.update({_id: req.params.id}, req.body, function(err, docs) {
            if(err) {
                res.json({error: true, res: err});
            }else{
                res.json({error: false, success: true});
            }
        });
    }
});

module.exports = router;