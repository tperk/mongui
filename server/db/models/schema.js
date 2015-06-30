var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	content: String
});

mongoose.model('Schema', schema);