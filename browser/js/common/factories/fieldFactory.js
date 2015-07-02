app.factory('fieldFactory', function ($http) {
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
		createField: function(body){
			return $http.post('/api/fields/', body)
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
				console.log("response data is ", response.data);
				return response.data;
			});
		},
		getAllFieldsById: function (schemaId) {
			return $http.get('/api/fields/schema/' + schemaId)
			.then(function (fields) {
				return fields.data;
			});
		}
	};
});