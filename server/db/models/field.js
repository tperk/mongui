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
		type: "String"
	}],
	generatedCode: {
		type: "String",
	}
});

mongoose.model('Field', schema);