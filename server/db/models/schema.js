var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	fields: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Field'
	}]
});

schema.pre('remove', function (next){
	if(this.fields.length > 0){
		this.populate('fields', function(err, parent){
			//async version
			Promise.map(parent.fields, function (field) {
				return field.remove();
			}).then(next);
			//sync version
			// for(var i = 0; i < parent.fields.length; i++){
			// 	parent.fields[i].remove();
			// }
		});
	}
	next();
});

schema.static('getFields', function (id) {

	return this.findById(id).populate('fields').exec()
		.then(function (schema) {
			return schema.fields;
		})

});

mongoose.model('Schema', schema);