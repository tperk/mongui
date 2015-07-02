app.config(function ($stateProvider) {

    $stateProvider.state('project', {
        url: '/project/:projectname/:projectid',
        templateUrl: 'js/project/project.html',
        controller: 'projectCtrl',
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
			$state.reload();
		});
	};

	//The put route exepects the schema _id to be inputted for req.body._id
	$scope.updateSchema = function (schema, schemaId) {
		SchemaFactory.updateSchema(schema, schemaId).then(function (response) {
		});
	};

	$scope.goToSchema = function (schema) {
		// $scope.currentSchema = schema.name;
		$state.go('project.schema', {schemaid: schema._id, schemaname: schema.name});
	};

	$scope.deleteSchema = function (schemaId) {
		SchemaFactory.deleteSchema(schemaId).then(function (response){
			$state.reload();
		});
	}
});

