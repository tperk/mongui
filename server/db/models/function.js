var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.model('Schema');

var schema = new mongoose.Schema({
	name: {
		type: "String",
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

schema.pre('remove', function (next){

	var self = this;

	Schema.findOne({
		functions:{
			$in: [self._id]
		} 
	}).exec()
	.then(function (schema) {

		schema.functions.pull(self._id);
		return schema.save();
	    
	}).then(next(), next());

});

mongoose.model('Func', schema);