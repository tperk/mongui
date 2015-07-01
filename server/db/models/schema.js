var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	fields: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Field'
	}]
});

mongoose.model('Schema', schema);