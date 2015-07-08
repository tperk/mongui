var mongoose = require('mongoose');
var Promise = require('bluebird');
var Project = mongoose.model('Project');

var schema = new mongoose.Schema({
	name: String,
	fields: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Field'
	}],
	functions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Function'
	}],
	exportSchema: String,
	exportSeed: String
});

schema.pre('remove', function (next){

	var self = this;

	Project.findOne({
		schemas:{
			$in: [self._id]
		}
	}).exec()
	.then(function (project) {
		project.schemas.pull(self._id)
		return project.save();
	}).then(function () {
		if(self.fields.length > 0){
			self.populate('fields', function(err, schema){
				return Promise.map(schema.fields, function (field) {
					if (!field.parents.length) {
						return field.remove();	
					}
					return 

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