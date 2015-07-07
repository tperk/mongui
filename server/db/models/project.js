var mongoose = require('mongoose');
var Promise = require('bluebird');
var User = mongoose.model('User');

var schema = new mongoose.Schema({
	name: String,
	schemas: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Schema'
	}]
});

schema.pre('remove', function (next){

	var self = this;

	User.find({
		projects:{
			$in: [self._id]
		}
	}).exec()
	.then(function (users) {
		return Promise.map(users, function (user) {
			user.projects.pull(self._id)
			return user.save();
		})
	})
	.then(function () {
		User.find({
			pendingProjects:{
				$in: [self._id]
			}
		}).exec()
		.then(function (users) {
			return Promise.map(users, function (user) {
				user.pendingProjects.pull(self._id)
				return user.save();
			})
		})
		return 
	})
	.then(function () {
		if(self.schemas.length > 0){
			self.populate('schemas', function(err, project){
				return Promise.map(project.schemas, function (schema) {
						return schema.remove();	
				}).then(next);
			});
		} else {
			next();
		}
	}).then(null, next);

});

schema.static('getSchemas', function (id) {

	return this.findById(id).populate('schemas').exec()
	.then(function (project) {
		return project.schemas
	})
	
});

mongoose.model('Project', schema);