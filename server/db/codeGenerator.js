// schema.pre('save', function (next) {

// 	var self = this;

// 	if (self.fieldType === Number) {
// 		numberCode(self)
// 	}

// })

// var handleValue = function (value) {
// 		if (typeof value === 'string') {
// 			return  '"' + value + '"'
// 		} else if (Array.isArray(value)) {
// 			if (!value.length) {
// 				return '[]'
// 			} else {
// 				var out = ''
// 				value.forEach(function (subval) {
// 					out += handleValue(subval) + ','
// 				})
// 				out = out.substring(0, out.length - 1)
// 				return '[' + out + ']'
// 			}
// 		} else {
// 			//booleans, numbers
// 			return value
// 		}
// 	}

// 	function codeConverter (field) {
// 		var out = ''
// 		out += field.name + ': ' 
// 		if (field.typeOptions.array) {
// 			out += '[{'
// 		} else {
// 			out += '{'
// 		}
// 		out += 'type: '+ field.fieldType + ', '
// 		if (field.required === true) {
// 			out += "required: true, "
// 		}
// 		for (var key in field.typeOptions) {
// 			if (key === 'stringEnums' || key === 'array') {
// 				if (key === 'stringEnums' && field.typeOptions.stringEnums.length > 0 && field.fieldType === 'String') {
// 					out += 'enum:' + handleValue(field.typeOptions[key]) + ', '
// 				} else {
// 				}
// 			} else {
// 				out += key + ': ' + handleValue(field.typeOptions[key]) + ', '
// 			}
// 		}
// 		out = out.substring(0, out.length - 2)
// 		if (field.typeOptions.array) {
// 			out += '}]'
// 		} else {
// 			out += '}'
// 		}
// 		return out
// 	}

// /*
// david psuedocode
// function outSchema(schema) {
//     return "var " + schema.name + " = new Schema({" + 
//         schema.fields.map(function(field) {
//             return outField(field);
//         })
//     + "});\n\n" + outVirtuals(schema) + outCustom(schema);


// }

// function outField(field) {
//     if(field.type="Number") {
//         return outNumberField(field)
//     }
// }

// function outNumberField(field) {
//     return field.name + ": " outNumberFieldOptions(field);
// }
// */ 
