var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');

var Celebrity = require('../models/Celebrity');
var Movies = require('../models/Movies');

router.get('/search/:q', function(req, res) {
	Celebrity.find({fullName: {$regex: "^" + req.params.q, $options: 'i'}})
		.limit(10)
       	.exec(function(err, docs) {
       		res.json(docs);
       	});
});

router.get('/all/:page', checkToken, function(req, res) {
    Celebrity.paginate({}, {page: req.params.page, limit: 10}, function(err, doc) {
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

router.get('/:id', checkToken, function(req, res) {
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

router.get('/movies/rated/:id', checkToken, function(req, res) {
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

router.get('/movies/:id', checkToken, function(req, res) {
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
})

module.exports = router;