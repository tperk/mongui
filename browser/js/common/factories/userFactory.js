app.factory('UserFactory', function($http) {
    return {
        addUser: function(newInfo) {
            return $http.post('/register', newInfo).then(function(response) {
                return response.data;
            });
        }
    };
});