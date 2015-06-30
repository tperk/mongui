app.config(function ($stateProvider) {

    $stateProvider.state('project', {
        url: '/project/:id',
        templateUrl: 'js/project/project.html',
        controller: 'projectCtrl',
        ncyBreadcrumb: {
            label: 'Project page'
        },
        resolve: {
        	user: function (AuthService) {
        		return AuthService.getLoggedInUser()
        	},
        	schemas: function (ProjectFactory, $stateParams) {
        		return ProjectFactory.getSchemas($stateParams.id);
        	}
        }
    });

});

app.controller('projectCtrl', function ($scope, schemas, user, $state, ProjectFactory, $stateParams) {

	console.log('project id', $stateParams.id)

	console.log('user', user)

	console.log('these are the schemas attached to this project', schemas);

	$scope.projectName = 'Stackstore';

	$scope.newSchema = {}
	$scope.schemas = schemas;

	$scope.submitSchema = function (newSchema) {
		console.log('newSchema', newSchema);
		ProjectFactory.submitNewSchema(newSchema, $stateParams.id).then(function (result) {
			console.log('submit new schema result: ', result);
			$state.reload();
		});
	};

	//The put route exepects the schema _id to be inputted for req.body._id
	$scope.updateSchema = function (schema, schemaId) {
		ProjectFactory.updateSchema(schema, schemaId).then(function (response) {
			console.log('updated schema response: ', response);
		});
	};
});

