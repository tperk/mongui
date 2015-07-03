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
			for(var i = 0; i < parent.fields.length; i++){
				parent.fields[i].remove();
			}
		});
	}
	next();
});

schema.static('getFields', function (id) {

	return this.findById(id).populate('fields').exec()
		.then(function (schema) {
			console.log('in schema schema', schema)
			return schema.fields;
		})

});

mongoose.model('Schema', schema);