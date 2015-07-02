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

mongoose.model('Schema', schema);