var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');

var Categories = require('../models/Categories');
var Movies = require('../models/Movies');
var formatFormErrorMessage = require('../utils/formatFormErrorMessage');

router.post('/add', function(req, res) {
	if(req.body) {
		var category = new Categories(req.body);
		category.save(function(err, doc) {
			if(err) {
				res.json({error: true, res: formatFormErrorMessage(err)});
			}else {
				res.json({error: false, res: doc});
			}
		})
	}
});

router.get('/all', function(req, res) {
	Categories.find({}, function(err, docs) {
		if(err) {
			console.log(err);
			res.json({error: true, msg: 'Something went wrong'});
		}
		res.json({error: false, res: docs});
	})
});

router.get('/:id', checkToken, function(req, res) {
	Categories.find({_id: req.params.id}, function(err, docs) {
		if(err) {
			console.log(err);
			res.json({error: true, msg: 'Something went wrong'});
		}else {
			res.json({error: false, res: docs});
		}
	})
});

router.put('/:id', checkToken, function(req, res) {
	Categories.update({_id: req.params.id}, req.body, function(err, docs) {
		if(err) {
			console.log(err);
			res.json({error: true, msg: 'Something went wrong'});
		}else {
			res.json({error: false, res: docs});
		}
	})
});

router.delete('/:id', checkToken, function(req, res) {
	Categories.find({_id: req.params.id}).remove(function(err, docs) {
		if(err) {
			console.log(err);
			res.json({error: true, msg: 'Something went wrong'});
		}else {
			res.json({error: false});
		}
	})
});

router.get('/movies/:id', function(req, res) {
	Movies.find({'category.categoryId': req.params.id}).populate('category.categoryId').exec(function(err, docs) {
		if(err) {
			console.log(err);
			res.json({error: true, msg: 'Something went wrong'});
		}else {
			res.json({error: false, res: docs});
		}
	})
});

router.put('/addMovieCount/:id', checkToken, function(req, res) {
	Categories.update({_id: req.params.id}, { $inc: { count: 1 }}).exec(function(err, doc) {
		if(err) {
			console.log(err);
			res.json({error: true, msg: 'Something went wrong'});
		}else {
			res.json({error: false});
		}
	})
});

router.put('/subtractMovieCount/:id', checkToken, function(req, res) {
	Categories.update({_id: req.params.id}, { $inc: { count: -1 }}).exec(function(err, doc) {
		if(err) {
			console.log(err);
			res.json({error: true, msg: 'Something went wrong'});
		}else {
			res.json({error: false});
		}
	})
});

module.exports = router;
