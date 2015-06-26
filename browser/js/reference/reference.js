app.config(function ($stateProvider) {

    $stateProvider.state('reference', {
        url: '/reference',
        templateUrl: 'js/reference/reference.html',
        controller: 'ReferenceCtrl'
    });

});

app.controller('ReferenceCtrl', function ($scope, $state) {

});