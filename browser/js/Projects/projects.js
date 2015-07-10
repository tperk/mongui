
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
app.controller('projectsCtrl', function ($timeout, $q, $log, $scope, $mdSidenav, ProjectsFactory, projects, user, $state, pendingProjects, UserFactory, userDictionary) {
    var self = this;
    $scope.sideNavProjectName = "";
    $scope.sideNavCollaborators = [];
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
    };

    $scope.deleteProject = function (projectId) {
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

    $scope.toggleCollaboratorSidenav = function(project) {
        $scope.sideNavProjectName = project.name;
        $scope.sideNavProjectId = project._id;
        UserFactory.getMembers(project._id).then(function(collaborators){
            console.log("collaborators ", collaborators);
            console.log('dictionary ', $scope.userDictionary);
            $scope.sideNavCollaborators = collaborators;
        });
        $mdSidenav('right').toggle();
    };

    $scope.addMember = function (projectId, email) {
        UserFactory.addMember(projectId, email).then(function(user){
            //add message here if !user
            UserFactory.getMembers(projectId).then(function(collaborators){
                console.log("collaborators ", collaborators);
                console.log('dictionary ', $scope.userDictionary);
                $scope.sideNavCollaborators = collaborators;
            });
            console.log("returned user!", user);
        })
            .catch(function(e) {console.log(e)});
    };
});
