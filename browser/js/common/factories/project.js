app.factory('ProjectFactory', function ($http) {
	return {
		submitNewSchema: function (newSchema, id) {
			return $http.post('/api/project/'+id, newSchema).then(function (result) {
				return result.data;
			});
		},
		getSchemas: function (id) {
			return $http.get('/api/project/'+id).then(function (schemas) {
				return schemas.data;
			});
		},
		updateSchema: function (schema, id) {
			return $http.put('/api/project/'+id, schema).then(function (result) {
				return result.data;
			});
		},
		deleteSchema: function (id) {
			return $http.delete('/api/project/'+ id).then(function (result) {
				return result.data;
			});
		}
	};
});