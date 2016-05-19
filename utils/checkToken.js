var jwt = require('jsonwebtoken');
var config = require('../config');

function checkToken(req, res, next) {
     // Pass to next layer of middleware
      var token = req.headers['authorization'];
      if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.TOKEN_SECRET, function(err, decoded) {      
          if (err) {
            res.send({ success: false, message: 'AUTHENTICATION_ERROR' });    
          } else {
          // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
          }
        });

      } else {

        // if there is no token
        // return an error
        return res.json({ 
          error: true,
          message: 'NO_TOKEN_PROVIDED'
        });

      }
}

module.exports = checkToken;