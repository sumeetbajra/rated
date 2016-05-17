var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var token = require('../utils/token');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Users = new Schema({
    userId: ObjectId,
    firstName: {type: String, validate: [validators.isAlpha(), validators.isLength(1, 60)]},
    lastName: {type: String, validate: [validators.isAlpha(), validators.isLength(1, 60)]},
    address: {type: String, validate: [validators.isAlphanumeric(), validators.isLength(1, 60)]},
    email: {type: String, validate: validators.isEmail()},
    username: {type: String, validate: [validators.isAlphanumeric(), validators.isLength(1, 60)]},
    password: {type: String, validate: [validators.isAlphanumeric(), validators.isLength(1, 100)]},
    timestamp: {type: Date, default: Date.now},
    verified: {type: Boolean, default: false},
    verificationToken: {type: String, default: token}
});

module.exports =  mongoose.model('Users', Users);