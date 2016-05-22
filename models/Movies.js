var mongoose = require('mongoose');
var validators = require('mongoose-validators');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Ratings = new Schema({
    rating: {type: String},
    review: {type: String},
    userId: {type: String, ref: 'Users'},
    timestamp: {type: Date, default: Date.now}
});

var Movies = new Schema({
    movieId: ObjectId,
    title: {type: String, validate: [validators.isLength(1, 60)]},
    description: {type: String, validate: [validators.isLength(1, 300)]},
    year: {type: Number, validate: [validators.isLength(1, 4)]},
    director: {type: String},
    cast: {type: String},
    duration: {type: Number, validate: [validators.isLength(1, 10)]},
    trailer: {type: String},
    posterUrl: {type: String},
    coverUrl: {type: String},
    ratings: [Ratings],
    timestamp: {type: Date, default: Date.now}    
});

module.exports =  mongoose.model('Movies', Movies);