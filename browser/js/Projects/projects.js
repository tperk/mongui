app.config(function ($stateProvider) {

    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'js/projects/projects.html',
        controller: 'projectsCtrl'
    });

});

app.controller('projectsCtrl', function ($scope, $mdSidenav, $state) {

    $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle();
    };
    $scope.closeLeftMenu = function() {
        $mdSidenav('left').toggle();
    }
    $scope.testschema = {

        playerstats: {
            name: {
                type: String
            },
            player: {
                type: String
            },
            class: [{
                name: String,
                level: Number
            }],
            race: {
                type: String
            },
            subtype: {
                type: String
            },
            deity: {
                type: String
            },
            alignment: {
                type: String
            },
            size: {
                type: String
            },
            age: {
                type: Number
            },
            gender: {
                type: String
            },
            height: {
                type: Number
            },
            weight: {
                type: Number
            },
            eyes: {
                type: String
            },
            hair: {
                type: String
            },
            skin: {
                type: String
            }
        }

    };

});
