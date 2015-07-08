app.factory('PackageFactory', function ($http){
	var packageProject = function(projectId){
		return $http.get('/api/package/' + projectId).then(function (response){
		 	return response.data;
		});
	};

	var exportProject = function(projectId){
		return $http.get('/api/package/zip/' + projectId).then(function (response){
		 	return response.data;
		});
	};

	return {
		packageProject: packageProject,
		exportProject: exportProject
	};
});