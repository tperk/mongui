app.config(function ($stateProvider) {
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'js/register/register.html',
        controller: 'RegisterCtrl'
    });
    $stateProvider.state('register.google', {
        url: '/google',
        templateUrl: 'js/register/google.html',
        controller: 'GoogleCtrl'
    });
    $stateProvider.state('register.facebook', {
        url: '/facebook',
        templateUrl: 'js/register/facebook.html',
        controller: 'FacebookCtrl'
    });
});

app.controller('RegisterCtrl', function ($scope, $state, AuthService, RegisterFactory) {
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
        RegisterFactory.addUser(signUpInfo).then(function(dbUserInfo){
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

app.controller('GoogleCtrl', function ($scope, $state, AuthService, RegisterFactory) {
    $scope.goToGoogle = function(){
        RegisterFactory.loginWithGoogle();
    }
    
});

app.controller('FacebookCtrl', function ($scope, $state, AuthService, RegisterFactory) {
    
});