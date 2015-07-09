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

schema.methods.cascadingRemoval = function(){
	var self = this;
	//update project
	return new Promise(function (resolve, reject){
		resolve(
			Project.findOne({
			schemas:{
				$in: [self._id]
			}
			}).exec()
			.then(function (project) {
				project.schemas.pull(self._id);
				return new Promise(function(resolve, reject){
					resolve(project.save());
				});
			})
			//cascading removal of child fields
			.then(function (savedProject) {
				return mongoose.model('Field').remove({_id: {$in: self.fields}}).exec();
			})
			.then(function(){
				return mongoose.model('Schema').remove({_id: self._id}).exec();
			})
			.then(function(){
				return;
			})
			
		); 
	});

};

schema.static('getFields', function (id) {
	return this.findById(id).populate('fields').exec()
		.then(function (schema) {
			return schema.fields;
		});

});

mongoose.model('Schema', schema);