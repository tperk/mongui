var mongoose = require('mongoose')

var schema = new mongoose.Schema({
	name: String,
	schemas: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Schema'
	}]

});

mongoose.model('Project', schema);