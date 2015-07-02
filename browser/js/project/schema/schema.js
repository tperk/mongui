app.config(function ($stateProvider) {

    $stateProvider.state('project.schema', {
        url: '/project/schema/:schemaid',
        templateUrl: 'js/project/schema/schema.html',
        controller: 'schemaCtrl',
        ncyBreadcrumb: {
            label: 'Schema page'
        },
        resolve: {
            fields: function (fieldFactory, $stateParams) {
                return fieldFactory.getAllFields($stateParams.schemaid);
            },
            currentSchema: function (SchemaFactory, $stateParams){
                return SchemaFactory.getSchemaById($stateParams.schemaid);
            }
        },
        data: {
            authenticate: true
        }

    });

});

app.controller('schemaCtrl', function ($scope, $mdSidenav, $state, fields, $stateParams, currentSchema) {
    $scope.currentSchema = currentSchema;
    $scope.testSchema = {

        one: {
            type: String
        },
        two: {
            twoOne: {
                type: String
            },
            twoTwo: {
                type: String
            }
        },
        three: {
            threeOne: {
                threeOneOne: {
                    type: String
                },
                threeOneTwo: {
                    type: String
                },
                threeOneThree: {
                    type: String
                }
            },
            threeTwo: {
                threeTwoOne: {
                    type: String
                },
                threeTwoTwo: {
                    type: String
                },
                threeTwoThree: {
                    type: String
                }
            },
            threeThree: {
                threeThreeOne: {
                    type: String
                },
                threeThreeTwo: {
                    type: String
                },
                threeThreeThree: {
                    type: String
                }
            }
        }
    };

    $scope.objectPath = [];
    $scope.currentPath = 'three.threeThree';

    //schema expects an object, path expects a simple path in the form 'key1.key2'

    var schemaParser = function (schema, path) {
        var parsed = [];
        var finalObj = schema;
        function keyCounter (obj) {
            var count = 0;
            Object.keys(obj).forEach(function (key) {
                count += 1;
            });
            return (count > 0 );
        }
        path.split('.').forEach(function (link) {
            parsed.push({name: link, child: false});
            finalObj = finalObj[link];
        });
        if (keyCounter(finalObj)) {
            Object.keys(finalObj).forEach(function (key) {
                if (typeof(finalObj[key]) === 'object') {
                    parsed.push({name: key, child: true});
                }
            });
        }
        return parsed;
    };

    $scope.objectPath = schemaParser($scope.testSchema, $scope.currentPath);
});