var mongoose = require('mongoose');
var validators = require('mongoose-validators');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var Categories = new Schema({
	categoryId: ObjectId,
	count: {type: Number, default: 0},
	categoryName: {type: String, required: [true, 'Category Name is required'], validate: [validators.isLength({message: 'Category name is invalid'}, 1, 60)]},
});

module.exports = mongoose.model('Categories', Categories);
