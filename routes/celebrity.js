var express = require('express');
var router = express.Router();
var checkToken = require('../utils/checkToken');

var Celebrity = require('../models/Celebrity');

router.get('/search/:q', function(req, res) {
	Celebrity.find({fullName: {$regex: "^" + req.params.q, $options: 'i'}})
		.limit(10)
       	.exec(function(err, docs) {
       		res.json(docs);
       	});
});

module.exports = router;