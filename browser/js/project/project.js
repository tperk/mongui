app.config(function ($stateProvider) {

    $stateProvider.state('project', {
        url: '/project/:projectname/:projectid',
        templateUrl: 'js/project/project.html',
        controller: 'projectCtrl',
		cache: false,
        ncyBreadcrumb: {
            label: 'Project page'
        },
        resolve: {
        	user: function (AuthService) {
        		return AuthService.getLoggedInUser();
        	},
        	schemas: function (SchemaFactory, $stateParams) {
        		return SchemaFactory.getSchemas($stateParams.projectid);
        	}
        },
        data: {
            authenticate: true
        }
    });

});

app.controller('projectCtrl', function ($scope, schemas, user, $state, SchemaFactory, $stateParams, $rootScope) {

	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {


	});

	//SIDEBAR FUNCTIONALITY 
	$scope.showSideBar = true;
	var toggleSideBar = function(){
		if($scope.showSideBar) $scope.showSideBar = false;
		else $scope.showSideBar = true;
	};
	$rootScope.$on("toggleSideBar", toggleSideBar);

	$scope.projectName = $stateParams.projectname;
	$scope.newSchema = {};
	$scope.schemas = schemas;

	$scope.submitSchema = function (newSchema) {
		SchemaFactory.submitNewSchema(newSchema, $stateParams.projectid).then(function (result) {
			SchemaFactory.getSchemas($stateParams.projectid).then(function(schemasArr){
				$scope.schemas = schemasArr;
			});
		});
	};

	//The put route exepects the schema _id to be inputted for req.body._id
	$scope.updateSchema = function (schema, schemaId) {
		SchemaFactory.updateSchema(schema, schemaId).then(function (response) {
		});
	};

	$scope.goToSchema = function (schema) {
		// $scope.currentSchema = schema.name;
		console.log('hitting')
		$state.go('project.schema', {schemaid: schema._id, schemaname: schema.name});
	};

	$scope.deleteSchema = function (schemaId) {
		SchemaFactory.deleteSchema(schemaId).then(function (response){
			//$state.reload();
			SchemaFactory.getSchemas($stateParams.projectid).then(function(schemasArr){
				$scope.schemas = schemasArr;

			});
		});
	}
});

