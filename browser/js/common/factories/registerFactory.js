app.factory('RegisterFactory', function($http) {
    return {
        addUser: function(newInfo) {
            return $http.post('/api/register', newInfo).then(function(response) {
                return response.data;
            });
        },
        loginWithGoogle: function() {
            return $http.get('/auth/google').then(function(response) {
                return response.data;
            });
        },
        loginWithFacebook: function() {
            return $http.get('/auth/facebook').then(function(response) {
                return response.data;
            });
        }
    };
});