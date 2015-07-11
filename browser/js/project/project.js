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
        	},
        	members: function (UserFactory, $stateParams) {
        		return UserFactory.getMembers($stateParams.projectid);
        	}
        },
        data: {
            authenticate: true
        }
    });

});

app.controller('projectCtrl', function ($scope, schemas, user, $state, SchemaFactory, $stateParams, $rootScope, UserFactory, members) {

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
			})
			.catch(function(e) {console.log(e);});
		});
	};

	//The put route exepects the schema _id to be inputted for req.body._id
	$scope.updateSchema = function (schema, schemaId) {
		SchemaFactory.updateSchema(schema, schemaId).then(function (response) {
		})
		.catch(function(e) {console.log(e);});
	};

	$scope.goToSchema = function (schema) {
		$state.go('project.schema', {
			schemaid: schema._id, 
			schemaname: schema.name, 
			projectid: $stateParams.projectid
		});
	};

	$scope.deleteSchema = function (schemaId) {
		SchemaFactory.deleteSchema(schemaId).then(function (response){
<<<<<<< HEAD
			// $state.reload();
<<<<<<< HEAD
			// return SchemaFactory.getSchemas($stateParams.projectid).then(function(schemasArr){
			// // 	$scope.schemas = schemasArr;

			// })
			// .catch(function(e) {console.log(e)});
			console.log('response is ', response)
=======
			return SchemaFactory.getSchemas($stateParams.projectid).then(function(schemasArr){
				$scope.schemas = schemasArr;

			})
			.catch(function(e) {console.log(e)});
			// console.log('response is ', response)
>>>>>>> bf9e5fcad280d7a2bd2b58a31eb7fda2141b87f8
=======

			return SchemaFactory.getSchemas($stateParams.projectid).then(function(schemasArr){
				$scope.schemas = schemasArr;
			})
			.catch(function(e) {console.log(e);});

>>>>>>> edd1323c89c06069225b40dc56be33a8d7fd7a4a
		});
	};
	$scope.backToProjects = function () {
			$state.go('home');
	};

});

