var mongoose = require('mongoose');
var Promise = require('bluebird')
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

schema.pre('remove', function (next) {
	var self = this;
	Schema.find({
		fields:{
			$in: [self._id]
		} 
	}).exec()
	.then(function (schemas) {
		return Promise.map(schemas, function(schema) {
	        schema.fields.pull(self._id);
	        return schema.save();
	    });
	})
	.then(null, next);
	next();
});

schema.pre('remove', function (next){
	if(this.children.length > 0){
		console.log('children before', this.children)
		this.recursiveRemove(this.children)
		console.log('children after', this.children)
	}
	next();
});

schema.methods.recursiveRemove = function (children) {
	var self = this
	children.forEach(function (childId) {
		self.constructor.remove({_id: childId})
	})
}

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