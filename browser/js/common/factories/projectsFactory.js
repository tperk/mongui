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
				console.log('response is ', response);
				return response.data;
			});
		},
		getPendingProjects: function (userId) {
			return $http.get('/api/projects/pending/'+userId).then(function (response) {
				return response.data;
			});
		},
		acceptPendingProjects: function (userId, projectId) {
			return $http.put('/api/projects/pending/'+userId+"/"+projectId).then(function (response) {
				return response.data;
			});
		},
		removePendingProjects: function (userId, projectId) {
			return $http.delete('/api/projects/pending/'+userId+"/"+projectId).then(function (response) {
				return response.data;
			});
		},
		getProject: function (projectId) {
			return $http.get('/api/projects/current/'+projectId).then(function (projects) {
				return projects.data;
			});
		},
		updateProject: function (projectId, currentProject) {
			return $http.put('/api/projects/'+projectId, currentProject).then(function (response) {
				return response.data;
			});
		}

		//need to give back project name and all the schema names
		//need to get version number
		//need to update and get indexjs 
	};
});