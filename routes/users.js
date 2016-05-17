var express = require('express');
var router = express.Router();
var Users = require('../models/Users');
var jwt = require('jsonwebtoken');
var config = require('../config.js');

var transporter = require('../utils/smtp');
/* GET users listing. */
router.get('/', function(req, res, next) {
    var user = new Users({
        firstName: 'Sumit',
        lastName: 'Bajracharya',
        address: 'Chhetrapati, Kathmandu',
        email: 'sumeetbajra@gmail.com',
        username: 'sumeetbajra',
        password: 'password'
    })
    user.save(function(err, doc) {
        if (err) console.log(err);
        console.log(doc);
    })
});

router.post('/register', function(req, res, next) {
    if(req.body) {
        var user = new Users(req.body);
        user.save(function(err, doc) {
            if (err) { 
                console.log(err);
                res.json({error: true, res: err});
            }else {

                var response = Object.assign({}, doc)._doc;              

                var mailOptions = {
                    from: '"Rated" <rated@example.com>', // sender address
                    to: response.email, // list of receivers
                    subject: 'Verify your account', // Subject line
                    text: 'http://localhost:8080/users/verify?token=' + response.verificationToken + '&userId=' + response._id, // plaintext body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    delete response.verificationToken;
                    delete response.password;
                    delete response._v;
                    res.json({error: false, res: response});
                });
            }
        })
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
                res.json({error: true, res: 'Invalid username or password'});
            }
        });
    }
});

module.exports = router;
