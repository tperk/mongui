
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

<<<<<<< HEAD
app.controller('projectsCtrl', function ($scope, $mdSidenav, ProjectsFactory, projects, user, $state, pendingProjects) {

=======
=======
>>>>>>> edd1323c89c06069225b40dc56be33a8d7fd7a4a
app.controller('projectsCtrl', function ($scope, $mdSidenav, ProjectsFactory, projects, user, $state, pendingProjects, UserFactory, userDictionary) {

    $scope.sideNavProjectName = "";
    $scope.sideNavCollaborators = [];
<<<<<<< HEAD
>>>>>>> bf9e5fcad280d7a2bd2b58a31eb7fda2141b87f8
=======
>>>>>>> edd1323c89c06069225b40dc56be33a8d7fd7a4a
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
        .catch(function(e) {console.log(e);});
    };

    $scope.goToProject = function (projectId, projectName) {
        $state.go('project', {projectname: projectName, projectid: projectId});
        console.log("GOING TO ");
    };

    $scope.deleteProject = function (projectId) {
        console.log("Deleting");
        ProjectsFactory.deleteProject(projectId).then(function (result) {
            $state.reload();
        })
        .catch(function(e) {console.log(e);});
    };

    $scope.acceptProject = function (project) {
        ProjectsFactory.acceptPendingProjects(user._id, project._id).then(function (){
            $state.reload();
        })
        .catch(function(e) {console.log(e);});
    };

    $scope.rejectProject = function (project) {
        ProjectsFactory.removePendingProjects(user._id, project._id).then(function (){
            $state.reload();
        })
        .catch(function(e) {console.log(e);});
    };

<<<<<<< HEAD
<<<<<<< HEAD
    $scope.toggleCollaboratorSidenav = function() {
        $mdSidenav('right').toggle();
=======
=======
>>>>>>> edd1323c89c06069225b40dc56be33a8d7fd7a4a
    $scope.toggleCollaboratorSidenav = function(project) {
        $scope.sideNavProjectName = project.name;
        $scope.sideNavProjectId = project._id;
        UserFactory.getMembers(project._id).then(function(collaborators){
            console.log("collaborators ", collaborators);
            console.log('dictionary ', $scope.userDictionary);
            $scope.sideNavCollaborators = collaborators;
        });
<<<<<<< HEAD
>>>>>>> bf9e5fcad280d7a2bd2b58a31eb7fda2141b87f8
=======
        $mdSidenav('right').toggle();
>>>>>>> edd1323c89c06069225b40dc56be33a8d7fd7a4a
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
