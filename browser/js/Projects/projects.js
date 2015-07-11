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
                return AuthService.getLoggedInUser();
            },
            projects: function (ProjectsFactory, user) {
                return ProjectsFactory.getProjects(user._id);
            },
            pendingProjects: function (ProjectsFactory, user) {
                return ProjectsFactory.getPendingProjects(user._id);
            },
            userDictionary: function(UserFactory){
                return UserFactory.getUserDictionary();
            }
        },
        data: {
            authenticate: true
        }
    });
});

<<<<<<< HEAD
app.controller('projectsCtrl', function ($scope, $mdSidenav, ProjectsFactory, projects, user, $state, pendingProjects) {

=======
app.controller('projectsCtrl', function ($scope, $mdSidenav, ProjectsFactory, projects, user, $state, pendingProjects, UserFactory, userDictionary) {
    $scope.sideNavProjectName = "";
    $scope.sideNavCollaborators = [];
>>>>>>> bf9e5fcad280d7a2bd2b58a31eb7fda2141b87f8
    $scope.projects = projects;
    $scope.pendingProjects = pendingProjects;
    $scope.newProject = {
        name: ''
    };
    $scope.userDictionary = userDictionary;

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

<<<<<<< HEAD
    $scope.toggleCollaboratorSidenav = function() {
        $mdSidenav('right').toggle();
=======
    $scope.toggleCollaboratorSidenav = function(project) {
        $scope.sideNavProjectName = project.name;
        $mdSidenav('right').toggle();
        UserFactory.getMembers(project._id).then(function(collaborators){
            console.log("collaborators ", collaborators);
            $scope.sideNavCollaborators = collaborators;
        });
>>>>>>> bf9e5fcad280d7a2bd2b58a31eb7fda2141b87f8
    };
    //$scope.addMember = function (email) {
    //    UserFactory.addMember($stateParams.projectid, email).then(function(user){
    //        //add message here if !user
    //        console.log(user);
    //    })
    //        .catch(function(e) {console.log(e)});
    //};
});
