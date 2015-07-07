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

schema.pre('remove', function (next){

	var self = this;

	Schema.findOne({
		fields:{
			$in: [self._id]
		} 
	}).exec()
	.then(function (schema) {

		schema.fields.pull(self._id);
		return schema.save();
	    
	}).then(function () {

		if(self.children.length > 0){
			self.populate('children', function(err, parent){
				Promise.map(parent.children, function (child) {
					return child.remove();
				}).then(next);
			});
		}

	}).then(function () {

		if(self.parents.length > 0){
			self.populate('parents', function (err, child) {
				Promise.map(child.parents, function (parent) {
					parent.children.pull(self._id);
					parent.save();
				}).then(next);
			})
		}

	})
	.then(null, next);
});

schema.methods.convertName = function() {
	if(this.name) {
		this.name = this.name.substr(0, 1).toLowerCase() + this.name.substr(1);
		this.name = this.name.replace(/[\W\s]/g, '_');
	}
};

schema.pre('save', function (next){
	//this.convertName();
	next();
});

mongoose.model('Field', schema);


