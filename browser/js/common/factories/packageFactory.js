app.factory('PackageFactory', function ($http){
	
	var addFileToProjectDir = function(file, schemaName, projectId){
		var obj = {
			projectId: projectId,
			schemaName: schemaName,
			file: file
		};
		
		return $http.post('/api/package/seed', obj).then(function (response){
		 	return response.data;
		});
	};

	return {
		addFileToProjectDir: addFileToProjectDir
	};
});