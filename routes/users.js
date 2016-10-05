var express = require('express');
var router = express.Router();
var Users = require('../models/Users');
var Movies = require('../models/Movies');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var checkToken = require('../utils/checkToken');

var transporter = require('../utils/smtp');
/* GET users listing. */
router.get('/:id', checkToken, function(req, res, next) {
    Users.findOne({_id: req.params.id}, function(err, doc) {
        if(err) res.end({error: true, res: err});
        res.json({
            error: false,
            res: doc
        })
    })
});

router.get('/ratings/:id', checkToken, function(req, res, next) {
    Movies.find({'ratings' : { $elemMatch: {'userId' : req.params.id}}}, function(err, doc) {
        if(err) res.end({error: true, res: err});
        res.json({
            error: false,
            res: doc
        })
    })
});

var registerUser = function(res, userData) {
    var user = new Users(userData);
    user.save(function(err, doc) {
        if (err) { 
            console.log(err);
            res.json({error: true, res: err});
            res.end();
        }else {
            var response = Object.assign({}, doc)._doc;              
            delete response.verificationToken;
            delete response.password;
            delete response._v;
            var token = jwt.sign(response, config.TOKEN_SECRET, {
                expiresIn: 1440 // expires in 24 hours
            });
            res.json({error: false, res: {
                    user: response,
                    token: token
                }
            });
        }
    })
}

router.post('/register', function(req, res, next) {
    if(req.body) {
        if(req.body.fbId) {
            Users.find({fbId: req.body.fbId}, function(err, doc) {
                if(doc.length) {
                     var token = jwt.sign(doc[0], config.TOKEN_SECRET, {
                        expiresIn: 1440 // expires in 24 hours
                    });
                    res.json({error: false, res: {
                            user: doc[0],
                            token: token
                        }
                    });
                }else {
                    registerUser(res, req.body);
                }
            })
        }else {
            registerUser(res, req.body);
        }
    }
});

router.get('/verify', function(req, res) {
    if(req.query.token && req.query.userId) {
        Users.find({_id: req.query.userId}, function(err, docs) {
            if(err) {
                res.json({error: true, res: err})
            }
            docs.verified = true;
            docs.save(function(err, docs) {
                if (err) {
                    res.json({error: true, res: err});
                }
                
            })
        })
    }
});

router.post('/login', function(req, res) {
    if(req.body.username && req.body.password) {
        Users.find({username: req.body.username, password: req.body.password}, function(err, docs) {
            if(err) {
                res.json({error: true, res: err})
            }
            if(docs.length) {
                // create a token
                var token = jwt.sign(docs[0], config.TOKEN_SECRET, {
                    expiresIn: 1440 // expires in 24 hours
                });
                res.json({error: false, res: {
                        user: docs[0],
                        token: token
                    }
                });
            }else {
                res.json({error: true, message: 'Invalid username or password'});
            }
        });
    }
});

module.exports = router;
