schema.pre('save', function (next) {

	var self = this;

	if (self.fieldType === Number) {
		numberCode(self)
	}

})

var numberCode = function (field) {
	var out = ''
	out += field.name + ': {'
	out += 'type: Number'
	for (var key in field.typeOptions) {
		out += key + ': ' + field.typeOptions[key]
	}
	out += '}'
}

/*
david psuedocode
function outSchema(schema) {
    return "var " + schema.name + " = new Schema({" + 
        schema.fields.map(function(field) {
            return outField(field);
        })
    + "});\n\n" + outVirtuals(schema) + outCustom(schema);


}

function outField(field) {
    if(field.type="Number") {
        return outNumberField(field)
    }
}

function outNumberField(field) {
    return field.name + ": " outNumberFieldOptions(field);
}
*/ 
