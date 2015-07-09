app.factory('fieldFactory', function ($http) {
	
    var indent = function (str, numOfIndents) {
        var indentString = "";
        for(var i=0; i<numOfIndents; i++){
            indentString = "    " + indentString;
        }
        str = indentString + str;
        return "\n"+str;
    };

	var handleValue = function (value) {
        if (typeof value === 'string') {
            return  '"' + value + '"'
        } else if (Array.isArray(value)) {
            if (!value.length) {
                return '[]'
            } else {
                var out = ''
                value.forEach(function (subval) {
                    out += handleValue(subval) + ','
                })
                out = out.substring(0, out.length - 1)
                return '[' + out + ']'
            }
        } else {
            //booleans, numbers
            return value
        }
    }

    function codeConverter (field) {
        var out = ''
        out += field.name + ': '
        if (field.typeOptions.array) {
            out += '[{'
        } else {
            out += '{'
        }
        out += indent('type: '+ field.fieldType + ', ', 1)
        if (field.required === true) {
            out += indent("required: true, ", 1)
        }
        for (var key in field.typeOptions) {
            if (key === 'stringEnums' || key === 'array') {
                if (key === 'stringEnums' && field.typeOptions.stringEnums.length > 0 && field.fieldType === 'String') {
                    out += indent('enum:' + handleValue(field.typeOptions[key]) + ', ', 1)
                } else {
                }
            } else {
                out += indent(key + ': ' + handleValue(field.typeOptions[key]) + ', ', 1)
            }
        }
        out = out.substring(0, out.length - 2)
        if (field.typeOptions.array) {
            out += '\n' + '}]'
        } else {
            out += '\n' + '}'
        }
        return out
    }

    function generateExportSchema (fields) {
        var out = ''
        fields.forEach(function (field) {
            out += field.generatedCode + ',' + '\n'
        })
        out = out.substring(0, out.length - 2)
        return out
    }


	return {
		getAllFields: function(){
			return $http.get('/api/fields/')
			.then(function (response){
				return response.data;
			});
		},
		getFieldById: function(fieldId){
			return $http.get('/api/fields/' + fieldId)
			.then(function (response){
				return response.data;
			});
		},
		// uncomment when engine is moved to schemacontroller
		// createField: function(body, schemaId){
		// 	return $http.post('/api/fields/'+schemaId, body)
		// 	.then(function (response){
		// 		return response.data;
		// 	});
		// },
		createField: function(schemaId, body){
			return $http.post('/api/fields/' + schemaId, body)
			.then(function (response){
				return response.data;
			});
		},
		editFieldById: function(fieldId, updatedField){
			return $http.put('/api/fields/' + fieldId, updatedField)
			.then(function (response){
				return response.data;
			});
		},
		deleteFieldById: function(fieldId){
			return $http.delete('/api/fields/' + fieldId)
			.then(function (response){
				return response.data;
			});
		},
		getAllFieldsById: function (schemaId) {
			return $http.get('/api/fields/schema/' + schemaId)
			.then(function (fields) {
				return fields.data;
			});
		},
		codeConverter: codeConverter,
		generateExportSchema: generateExportSchema
	};
});