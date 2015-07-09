var mongoose = require('mongoose');
var Promise = require('bluebird');

var schema = new mongoose.Schema({
	name: {
		type: "String",
	},
	required: {
		type: "Boolean",
	},
	functionType: {
		type: "String",
		enum: ['Getset', 'Hook', 'Method', 'Static', 'Virtual'],
	},
	typeOptions: {},
	generatedCode: {
		type: "String",
	}
});

mongoose.model('Func', schema);