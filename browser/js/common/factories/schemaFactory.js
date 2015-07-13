app.factory('SchemaFactory', function ($http, TemplateFactory){	
	return {
		getSchemaById: function(schemaId){
			return $http.get('/api/schemas/' + schemaId)
				.then(function (response){
					return response.data;
				});
		},
		getFieldsBySchemaId: function (id) {
			return $http.get('/api/schemas/fields/'+id)
				.then(function (fields) {
					return fields.data;
				});
		},
		getFunctionsBySchemaId: function (id) {
			return $http.get('/api/schemas/functions/'+id)
				.then(function (functions) {
					return functions.data;
				});
		},
		submitNewSchema: function (newSchema, id) {
			return $http.post('/api/schemas/'+id, newSchema).then(function (result) {
				return result.data;
			});
		},
		getSchemas: function (id) {
			return $http.get('/api/projects/schemas/'+id).then(function (schemas) {
				return schemas.data;
			});
		},
		updateSchema: function (schema, id) {
			return $http.put('/api/schemas/'+id, schema).then(function (result) {
				return result.data;
			});
		},
		deleteSchema: function (id) {
			return $http.delete('/api/schemas/'+ id).then(function (result) {
				return result.data;
			});
		}
	};
});