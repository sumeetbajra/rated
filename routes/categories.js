var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');

var Categories = require('../models/Categories');
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

router.get('/all', checkToken, function(req, res) {
	Categories.find({}, function(err, docs) {
		if(err) {
			console.log(err);
			res.json({error: true, msg: 'Something went wrong'});
		}
		res.json({error: false, res: docs});
	})
})

module.exports = router;