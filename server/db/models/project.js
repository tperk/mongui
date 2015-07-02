var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	schemas: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Schema'
	}]
});

schema.pre('remove', function (next){
	if(this.schemas.length > 0){
		this.populate('schemas', function(err, parent){
			for(var i = 0; i < parent.schemas.length; i++){
				parent.schemas[i].remove();
			}
		});
	}
	next();
});

mongoose.model('Project', schema);