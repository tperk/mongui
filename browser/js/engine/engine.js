app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('engine', {
        url: '/engine',
        controller: 'EngineController',
        templateUrl: 'js/engine/engine.html'
    });

});

app.controller('EngineController', function ($scope) {
	$scope.toPass="anything really";

});