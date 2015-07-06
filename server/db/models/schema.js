var mongoose = require('mongoose');
var Promise = require('bluebird');
var Project = mongoose.model('Project');

var schema = new mongoose.Schema({
	name: String,
	fields: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Field'
	}]
});

schema.pre('remove', function (next){
	var self = this;

	Project.findOne({
		schemas:{
			$in: [self._id]
		}
	}).exec()
	.then(function (project) {
		if (project) {
			project.schemas.pull(self._id)
			return project.save();
		} else {
			return;
		}
		
	}).then(function () {
		if(self.fields.length > 0){
			self.populate('fields', function(err, schema){
				return Promise.map(schema.fields, function (field) {
					if (!field.parents.length) {
						console.log('field', field)
						return field.remove();	
					} else {
						return;
					}
					

				}).then(next);
			});
		} else {
			next();
		}
	}).then(null, next);

});

schema.static('getFields', function (id) {

	return this.findById(id).populate('fields').exec()
		.then(function (schema) {
			return schema.fields;
		})

});

mongoose.model('Schema', schema);