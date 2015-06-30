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

app.controller('projectsCtrl', function ($scope, ProjectsFactory, projects, $state) {

    console.log('here are the current projects in the database: ', projects)

    $scope.newProject = {
        name: ''
    };

    $scope.submitProject = function (newProject) {
        console.log('newProject', newProject)
        ProjectsFactory.submitNewProject(newProject).then(function (result) {
            console.log('submit new project result: ', result);
        });
    };

});
