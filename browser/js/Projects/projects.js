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
            },
            pendingProjects: function (ProjectsFactory, user) {
                return ProjectsFactory.getPendingProjects(user._id);
            }
        },
        data: {
            authenticate: true
        }
    });
});

app.controller('projectsCtrl', function ($scope, $mdSidenav, ProjectsFactory, projects, user, $state, pendingProjects) {

    $scope.projects = projects;
    $scope.pendingProjects = pendingProjects;

    $scope.newProject = {
        name: ''
    };

    $scope.submitProject = function (newProject) {
        ProjectsFactory.submitNewProject(newProject, user._id).then(function (result) {
            $state.reload();
        })
        .catch(function(e) {console.log(e)});
    };

    $scope.goToProject = function (projectId, projectName) {
        $state.go('project', {projectname: projectName, projectid: projectId})
        console.log("GOING TO ");
    };

    $scope.deleteProject = function (projectId) {
        console.log("Deleting")
        ProjectsFactory.deleteProject(projectId).then(function (result) {
            $state.reload();
        })
        .catch(function(e) {console.log(e)});
    };

    $scope.acceptProject = function (project) {
        ProjectsFactory.acceptPendingProjects(user._id, project._id).then(function (){
            $state.reload();
        })
        .catch(function(e) {console.log(e)});
    };

    $scope.rejectProject = function (project) {
        ProjectsFactory.removePendingProjects(user._id, project._id).then(function (){
            $state.reload();
        })
        .catch(function(e) {console.log(e)});
    };

    $scope.toggleCollaboratorSidenav = function() {
        $mdSidenav('right').toggle();
    };
    //$scope.addMember = function (email) {
    //    UserFactory.addMember($stateParams.projectid, email).then(function(user){
    //        //add message here if !user
    //        console.log(user);
    //    })
    //        .catch(function(e) {console.log(e)});
    //};
});
