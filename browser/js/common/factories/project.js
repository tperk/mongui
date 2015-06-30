app.factory('ProjectFactory', function ($http) {
	return {
		submitNewSchema: function (newSchema) {
			return $http.post('/api/project', {
				params: newSchema
			}).then(function (result) {
				return result.data;
			});
		},
		getSchemas: function () {
			return $http.get('/api/project').then(function (schemas) {
				return schemas.data;
			});
		},
		updateSchema: function (schema) {
			return $http.put('/api/project', schema).then(function (result) {
				return result.data;
			});
		}
	};
});