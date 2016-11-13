var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Ratings = new Schema({
    rating: {type: String},
    review: {type: String},
    userId: {type: String, ref: 'Users'},
    timestamp: {type: Date, default: Date.now}
});

var Celebrities = new Schema({
    celebrityId: {type: String, ref: 'Celebrity'}
})

var Movies = new Schema({
    movieId: ObjectId,
    title: {type: String, validate: [validators.isLength(1, 60)]},
    description: {type: String, validate: [validators.isLength(1, 1000)]},
    year: {type: Number, validate: [validators.isLength(1, 4)]},
    director: [Celebrities],
    cast: [Celebrities],
    duration: {type: Number, validate: [validators.isLength(1, 10)]},
    trailer: {type: String},
    posterUrl: {type: String},
    coverUrl: {type: String},
    ratings: [Ratings],
    overallRating: {type: Number, default: 0},
    ratingsCount: {type: Number, default: 0},
    timestamp: {type: Date, default: Date.now}    
});

Movies.plugin(mongoosePaginate);

module.exports = mongoose.model('Movies', Movies);