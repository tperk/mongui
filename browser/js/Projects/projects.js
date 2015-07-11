
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
app.controller('projectsCtrl', function ($mdDialog, $scope, $mdSidenav, ProjectsFactory, projects, user, $state, pendingProjects, UserFactory, userDictionary, PackageFactory) {
    $scope.sideNavProjectName = "";
    $scope.sideNavCollaborators = [];
    $scope.projects = projects;
    $scope.pendingProjects = pendingProjects;
    $scope.newProject = {
        name: ''
    };
    $scope.userDictionary = userDictionary;
    $scope.alert = '';

    $scope.packageProject = function (projectid) {
        PackageFactory.packageProject(projectid).then(function(message){
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Your Package Is Ready To NPM Install')
                    .content(message)
                    .ariaLabel('Your Package Has Been Published TO NPM!')
                    .ok('OK!')
            );
        }).catch(function(e) {console.log(e);});
    };

    $scope.exportPackageToZip = function (projectid) {
        PackageFactory.exportProject(projectid).then(function(fileName){
            var a = window.document.createElement('a');
            a.href = fileName;
            a.target = "_self";
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    };

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
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('A New User Has Been Invited To Your Project')
                    .content(email)
                    .ariaLabel('New User')
                    .ok('OK!')
            );
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
