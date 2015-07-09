var mongoose = require('mongoose');
var Promise = require('bluebird');
var User = mongoose.model('User');
mongoose = Promise.promisifyAll(mongoose);

var schema = new mongoose.Schema({
	name: String,
	schemas: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Schema'
	}]
});

// schema.pre('remove', function (next){

// 	var self = this;

// 	User.find({
// 		projects:{
// 			$in: [self._id]
// 		}
// 	}).exec()
// 	.then(function (users) {
// 		return Promise.map(users, function (user) {
// 			user.projects.pull(self._id);
// 			return user.save();
// 		});
// 	})
// 	.then(function () {
// 		return User.find({
// 			pendingProjects:{
// 				$in: [self._id]
// 			}
// 		}).exec();
// 	})
// 	.then(function (users) {
// 		return Promise.map(users, function (user) {
// 			user.pendingProjects.pull(self._id);
// 			return user.save().exec();
// 		});
// 	})
// 	.then(function () {
// 		return mongoose.model('Schema').remove({_id: {$in: self.schemas}}).exec();
// 	}).then(function(){next()}, next);
	
// });

schema.methods.cascadingRemoval = function (){
	var self = this;
	User.find({
		projects:{
			$in: [self._id]
		}
	}).exec()
	.then(function (users) {
		return Promise.map(users, function (user) {
			user.projects.pull(self._id);
			return user.save();
		});
	})
	.then(function () {
		return User.find({
			pendingProjects:{
				$in: [self._id]
			}
		}).exec();
	})
	.then(function (users) {
		return Promise.map(users, function (user) {
			user.pendingProjects.pull(self._id);
			return user.save().exec();
		});
	})
	.then(function () {
		return Promise.resolve( mongoose.model('Schema').find({_id: {$in: self.schemas}}).exec());
	})
	.then(function(schemas){
		console.log("SCHEMA", schema);
		var promiseFactories = [];
		schemas.forEach(function(schema){
			promiseFactories.push(function(){return schema.cascadingRemoval()});
		});
		// console.log("PROMISE FACTORIES ARE ", promiseFactories);
		var executeSequentially = function(promiseFactories){
			var result = Promise.resolve();
			promiseFactories.forEach(function(promiseFactory){
				result = result.then(promiseFactory);
			});
			return result;
		};
		return executeSequentially(promiseFactories);
	})
	.then(function (idk){
		console.log("all is done ", idk);
		return mongoose.model('Project').remove({_id: self._id}).exec();
	});
};

schema.static('getSchemas', function (id) {

	return this.findById(id).populate('schemas').exec()
	.then(function (project) {
		return project.schemas;
	});
	
});

mongoose.model('Project', schema);