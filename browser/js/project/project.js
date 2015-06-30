app.config(function ($stateProvider) {

    $stateProvider.state('project', {
        url: '/project',
        templateUrl: 'js/project/project.html',
        controller: 'projectCtrl',
        ncyBreadcrumb: {
            label: 'Project page'
        },
        resolve: {
        	schemas: function (ProjectFactory) {
        		return ProjectFactory.getSchemas();
        	}
        }
    });

});

app.controller('projectCtrl', function ($scope, schemas, $state, ProjectFactory) {

	console.log('these are the schemas attached to this project', schemas);

	$scope.projectName = 'Stackstore';
	$scope.schemas = ['Users', 'Listings', 'Items'];

	$scope.submitSchema = function (newSchema) {
		console.log('newSchema', newSchema);
		ProjectFactory.submitNewSchema(newSchema).then(function (result) {
			console.log('submit new schema result: ', result);
		});
	};

	//The put route exepects the schema _id to be inputted for req.body._id
	$scope.updateSchema = function (schema) {
		ProjectFactory.updateSchema(schema).then(function (response) {
			console.log('updated schema response: ', response);
		});
	};
});

