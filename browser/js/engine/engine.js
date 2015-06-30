app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('engine', {
        url: '/engine',
        controller: 'EngineController',
        templateUrl: 'js/engine/engine.html'
    });

});

app.controller('EngineController', function ($scope, fieldFactory) {

	$scope.setAllFields = function(){
		fieldFactory.getAllFields().then(function(fields){
			$scope.fields = fields;
		});
	};
	
	$scope.createField = function(){
		var name = prompt("What's the name of the field");
		$scope.fieldArr[name] = new $scope.fieldConstructor(name);
		console.log($scope.fieldArr);
	};

	$scope.deleteField = function(id){
		console.log("DELETE CALLED WITH ", id);
		fieldFactory.deleteFieldById(id).then(function (response){
			$scope.setAllFields();
		});
	};
	$scope.setAllFields();

	

});