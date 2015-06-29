app.factory('ProjectsFactory', function ($http) {
	return {
		submitNewProject: function (newProject) {
			return $http.post('/api/projects', {
				params: newProject
			}).then(function (result) {
				return result.data;
			});
		},
		getProjects: function () {
			return $http.get('/api/projects').then(function (projects) {
				return projects.data;
			});
		}
	};
});