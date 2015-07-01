var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	content: String,
	functions: String
});

mongoose.model('Schema', schema);