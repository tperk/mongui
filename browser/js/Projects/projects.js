app.config(function ($stateProvider) {

    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'js/projects/projects.html',
        controller: 'projectsCtrl',
        ncyBreadcrumb: {
            label: 'Projects page'
        },
        resolve: {
            user: function (AuthService) {
                return AuthService.getLoggedInUser()
            },
            projects: function (ProjectsFactory, user) {
                return ProjectsFactory.getProjects(user._id);
            }
        },
        data: {
            authenticate: true
        }
    });
});

app.controller('projectsCtrl', function ($scope, ProjectsFactory, projects, user, $state) {

    $scope.projects = projects

    $scope.newProject = {
        name: ''
    };

    $scope.submitProject = function (newProject) {
        ProjectsFactory.submitNewProject(newProject, user._id).then(function (result) {
            $state.reload();
        });
    };

    $scope.goToProject = function (projectId, projectName) {
        $state.go('project', {projectname: projectName, projectid: projectId})
    }

    $scope.deleteProject = function (projectId) {
        ProjectsFactory.deleteProject(projectId).then(function (result) {
            $state.reload();
        });
    }

});
