app.config(function ($stateProvider) {

    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'js/projects/projects.html',
        controller: 'projectsCtrl',
        ncyBreadcrumb: {
            label: 'Projects page'
        },
        resolve: {
            projects: function (ProjectsFactory) {
                return ProjectsFactory.getProjects();
            }
        }
    });

});

app.controller('projectsCtrl', function ($scope, ProjectsFactory, $state) {

    $scope.newProject = {
        name: ''
    };

    $scope.submitProject = function (newProject) {
        ProjectsFactory.submitNewProject(newProject).then(function (result) {
            console.log('submit new project result: ', result);
        });
    };

});
