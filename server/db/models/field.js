var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {
		type: "String",
		required: "true" 
	},
	required: {
		type: "Boolean",
		required: "true"
	},
	fieldType: {
		typeName: {
			type: "String",
			enum: ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'Object', 'Objectid', 'Array'],
			//required: "true"
		}
	},
	children: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Field'
	}],
	generatedCode: {
		type: "String",
	}
});

mongoose.model('Field', schema);