var mongoose = require('mongoose');

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
	if(this.children.length > 0){
		this.populate('children', function(err, parent){
			for(var i = 0; i < parent.children.length; i++){
				parent.children[i].remove();
			}
		});
	}
	next();
});

mongoose.model('Field', schema);