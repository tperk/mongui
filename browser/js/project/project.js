app.config(function ($stateProvider) {

    $stateProvider.state('project', {
        url: '/project',
        templateUrl: 'js/project/project.html',
        controller: 'projectCtrl',
        ncyBreadcrumb: {
            label: 'Project page'
        }
    });

});

app.controller('projectCtrl', function ($scope, $mdSidenav, $state) {

	$scope.schemas = ['Users', 'Listings', 'Items']
    $scope.projectName = 'Stackstore';
});

