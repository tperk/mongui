
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
        $scope.showLoading = true;
        PackageFactory.packageProject(projectid).then(function(message){
            $scope.showLoading = false;
            $scope.alert = message;
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope, //use parent scope in template
                preserveScope: true,
                template:
                    '<md-dialog style="opacity:0.9;">' +
                        '  <md-dialog-content>'+
                    '       <h4 style="color:white;">Your Package Is Ready To NPM Install!</h4>' +
                    '           <hr/>' +
                    '           <div style="color:white;">{{alert}}</div>' +
                    '  </md-dialog-content>' +
                    '  <div class="md-actions">' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Close Dialog' +
                    '    </md-button>' +
                    '  </div>' +
                    '</md-dialog>',
                controller: function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    };
                }
            });
        //});
        }).catch(function(e) {console.log(e);});
    };

    $scope.exportPackageToZip = function (projectid) {
        $scope.showLoading = true;
        PackageFactory.exportProject(projectid).then(function(fileName){
            $scope.showLoading = false;
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
    };

    $scope.deleteProject = function (projectId) {
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
            $scope.sideNavCollaborators = collaborators;
        });
        $mdSidenav('right').toggle();
    };

    $scope.addMember = function (projectId, email) {
        $scope.showLoading = true;
        UserFactory.addMember(projectId, email).then(function(user){
            $scope.showLoading = false;
            $scope.alert = email;
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope, //use parent scope in template
                preserveScope: true,
                template:
                    '<md-dialog style="opacity:0.9;">' +
                        '  <md-dialog-content>'+
                    '       <h4 style="color:white;">New User Added!</h4>' +
                    '           <hr/>' +
                    '           <div style="color:white;">{{alert}}</div>' +
                    '  </md-dialog-content>' +
                    '  <div class="md-actions">' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Close Dialog' +
                    '    </md-button>' +
                    '  </div>' +
                    '</md-dialog>',
                controller: function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    };
                }
            });
            UserFactory.getMembers(projectId).then(function(collaborators){
                $scope.sideNavCollaborators = collaborators;
            });
            console.log("returned user!", user);
        })
        .catch(function(e) {console.log(e)});
    };
});
