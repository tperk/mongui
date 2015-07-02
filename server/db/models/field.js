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

// schema.method('childDelete', function (){
// 	return this.model('Field')
// 		var deletedChildren = parent.children.map(function(child){
// 			return childDelete(child);
// 		});
// 		deletedChildren.push(Field.findByIdAndRemove(parent._id).exec());
// 		return Promise.all(deletedChildren);
// 	});

// })

mongoose.model('Field', schema);