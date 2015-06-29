app.config(function ($stateProvider) {

    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'js/projects/projects.html',
        controller: 'projectsCtrl',
        ncyBreadcrumb: {
            label: 'Projects page'
        }
    });

});

app.controller('projectsCtrl', function ($scope, $mdSidenav, $state) {

    $scope.newProject = {
        name: ''
    }

    $scope.submitProject = function () {

    }

});
