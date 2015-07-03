app.factory('UserFactory', function($http) {
    return {
        addUser: function(newInfo) {
            return $http.post('/register', newInfo).then(function(response) {
                return response.data;
            });
        },
        addMember: function(projectid, userEmail){
        	return $http.post('/api/users/' + projectid, {email: userEmail}).then(function(response) {
                return response.data;
            });
        },
        getMembers: function(projectid){        	
        	return $http.get('/api/users/' + projectid).then(function(response) {
                return response.data;
            });
        }
    };
});