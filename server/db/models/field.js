var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.model('Schema');

var schema = new mongoose.Schema({
	name: {
		type: "String",
	},
	required: {
		type: "Boolean",
	},
	fieldType: {
		type: "String",
		enum: ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'Object', 'Objectid', 'Nested'],
	},
	typeOptions: {},
	children: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Field'
	}],
	parents: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Field'
	}],
	generatedCode: {
		type: "String",
	}
});

// schema.pre('remove', function (next){

// 	var self = this;

// 	Schema.findOne({
// 		fields:{
// 			$in: [self._id]
// 		} 
// 	}).exec()
// 	.then(function (schema) {
// 		if (schema) {
// 			debugger;
// 			schema.fields.pull(self._id);
// 			return promisifiedSave(schema);
// 		} else {
// 			return;
// 		}
// 	}).then(function () {

// 		return new Promise(function (resolve, reject) {

// 			if(self.children.length > 0) {

// 				self.populate('children', function(err, parent){
// 					debugger;
// 					Promise.map(parent.children, function (child) {
// 						debugger;
// 						return promisifiedRemove(child);
// 					}, { concurrency: 1 }).then(resolve);
// 				});

// 			} else {
// 				resolve();
// 			}

// 		});
		

// 	}).then(function () {

// 		return new Promise(function (resolve, reject) {

// 			if(self.parents.length > 0){
				
// 				self.populate('parents', function (err, child) {
				
// 					Promise.map(child.parents, function (parent) {
// 						debugger;
// 						if (parent) {
// 							parent.children.pull(self._id);
// 							return promisifiedSave(parent);
// 						} else {
// 							return;
// 						}		
// 					}).then(resolve);

// 				});

// 			} else {

// 				resolve();

// 			}

// 		});

// 	})
// 	.then(next, next);
// });

schema.methods.convertName = function() {
	if(this.name) {
		this.name = this.name.substr(0, 1).toLowerCase() + this.name.substr(1);
		this.name = this.name.replace(/[\W\s]/g, '_');
	}
};

var removeField = function (id) {

	return mongoose.model('Field').findById(id).exec()
		.then(function (field) {
			if (field.children.length > 0) {
					var removalPromises = field.children.map(removeField);
					return Promise.all(removalPromises);
				} else {
					return;
				}
		}).then(function () {
			return mongoose.model('Field').findByIdAndRemove(id).exec();
		});
		
};

schema.methods.nestedRemove = function () {

	var self = this;

	return new Promise(function (resolve, reject) {
		if (self.children.length > 0) {
			var promises = self.children.map(removeField);
			return Promise.all(promises).then(resolve);
		} else {
			resolve();
		}
	}).then(function () {
		return new Promise(function (res, rej) {
			self.remove(function (e) {
				if (e) rej(e);
				res();
			});	
		});
	});
};


mongoose.model('Field', schema);


