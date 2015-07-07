var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = require('./schema.js');
// var Schema = mongoose.model('Schema');
Promise.promisifyAll(mongoose);

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
	//find Field
	var cache = []; 
	return mongoose.model('Field').findById(id).exec()
		//if it has children, map the promises for the recursive calls
		.then(function (field) {
			if (field.children.length > 0) {
					var removalPromises = field.children.map(removeField);
					return Promise.all(removalPromises);
				} else {
					return;
				}
		})
		//find the schema that contains a reference to it
		.then(function (){
			return mongoose.model('Schema').findOne({fields: {$in: [id]}});
		})
		//pull the id out of the schema
		.then(function(schema){
			console.log("FOUND ", schema);
			schema.fields.pull(id);
			return schema.save();
		})
		//remove the child from DB
		.then(function () {
			return mongoose.model('Field').findByIdAndRemove(id).exec();
		});
		
};


// TODO Remove reference from parent schema
schema.methods.nestedRemove = function () {

	var self = this;
	//recursively remove children and their references in parent schema
	return new Promise(function (resolve, reject) {
		if (self.children.length > 0) {
			var promises = self.children.map(removeField);
			return Promise.all(promises).then(resolve);
		} else {
			resolve();
		}
	})
	//remove reference from parent field
	.then(function () {
		return new Promise(function (res, rej) {
			if(self.parents.length > 0){
				mongoose.model('Field').findById(self.parents[self.parents.length -1])
				.then(function(parent){
					parent.children.pull(self._id);
					return parent.save();
				}).then(res);
			} else res();
		});
	})
	//remove reference from parent schema
	.then(function (){
		return new Promise(function (res, rej) {
			mongoose.model('Schema').findOne({fields: {$in: [self._id]}})
			.then(function(schema){
				schema.fields.pull(self._id);
				return schema.save();
			}).then(res);
		});
	})
	//remove itself
	.then(function (){
		return new Promise(function (res, rej) {
			self.remove(function (e) {
				if (e) rej(e);
				res();
			});	
		});
	});
};


mongoose.model('Field', schema);


