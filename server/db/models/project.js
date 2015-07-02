var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	schemas: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Schema'
	}]

});

schema.static('getSchemas', function (id) {

	return this.findById(id).populate('schemas').exec()
	.then(function (project) {
		return project.schemas
	})
	
});

mongoose.model('Project', schema);