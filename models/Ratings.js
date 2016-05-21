var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Ratings = new Schema({
    ratingId: ObjectId,
    movieId: {type: String},
    rating: {type: String},
    review: {type: String},
    userId: {type: String},
    timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Ratings', Ratings);