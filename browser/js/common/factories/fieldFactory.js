app.factory('fieldFactory', function ($http) {
	
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
        // Number
        var out = ''
        out += field.name + ': ' 
        if (field.typeOptions.array) {
            out += '[{'
        } else {
            out += '{'
        }
        out += 'type: '+ field.fieldType + ', '
        if (field.required === true) {
            out += "required: true, "
        }
        for (var key in field.typeOptions) {
            if (key === 'stringEnums' || key === 'array') {
                if (key === 'stringEnums' && field.typeOptions.stringEnums.length > 0 && field.fieldType === 'String') {
                    out += 'enum:' + handleValue(field.typeOptions[key]) + ', '
                } else {
                }
            } else {
                out += key + ': ' + handleValue(field.typeOptions[key]) + ', '
            }
        }
        out = out.substring(0, out.length - 2)
        if (field.typeOptions.array) {
            out += '}]'
        } else {
            out += '}'
        }
        return out
    }

    function generateExportSchema () {
        var fieldCodes = []
        $scope.fields.forEach(function (field) {
            fieldCodes.push(field)
        })
        
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