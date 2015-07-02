app.config(function ($stateProvider) {
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'js/register/register.html',
        controller: 'RegisterCtrl'
    });
});

app.controller('RegisterCtrl', function ($scope, $state, AuthService, UserFactory) {
    $scope.passwordsMatched = true;
    var loginInfo;

    $scope.isMatched = function(){
        if($scope.userInfo.password === $scope.userInfo.confirmPassword){
            $scope.passwordsMatched = true;
        }else{
            $scope.passwordsMatched = false;
        } 
        return $scope.passwordsMatched;
    };

    $scope.signUp = function(signUpInfo) {        
        UserFactory.addUser(signUpInfo).then(function(dbUserInfo){
            loginInfo = {
                email: dbUserInfo.email,
                password: $scope.userInfo.password,
                firstName: $scope.userInfo.firstName,
                lastName: $scope.userInfo.lastName
            };
            AuthService.login(loginInfo).then(function (response) {
                $state.go('home');
            });
        });
    };
});