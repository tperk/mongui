app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        controller: 'homeCtrl',
        url: '/',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('homeCtrl', function ($scope, $state, AuthService) {

});