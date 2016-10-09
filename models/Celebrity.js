var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var Celebrity = new Schema({
	celebrityId: ObjectId,
	fullName: {type: String},
	birthDate: {type: Number},
	birthPlace: {type: String},
	bio: {type: String},
	picture: {type: String, default: "https://world-outreach.com/wp-content/uploads/2014/08/placeholder-profile-male.jpg"}

});

Celebrity.index({fullName: 'text'});

module.exports = mongoose.model('Celebrity', Celebrity);