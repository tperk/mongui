app.factory('ProjectsFactory', function ($http) {
	return {
		submitNewProject: function (newProject, id) {
			return $http.post('/api/projects/'+id, {
				params: newProject
			}).then(function (result) {
				return result.data;
			});
		},
		getProjects: function (id) {
			return $http.get('/api/projects/'+id).then(function (projects) {
				return projects.data;
			});
		},
		deleteProject: function (id) {
			return $http.delete('/api/projects/'+id).then(function (response) {
				return response.data;
			});
		}
	};
});