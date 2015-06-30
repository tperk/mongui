app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('engine', {
        url: '/engine',
        controller: 'EngineController',
        templateUrl: 'js/engine/engine.html'
    });

});

app.controller('EngineController', function ($scope) {
	$scope.fieldArr = {};
	$scope.fieldConstructor = function(name){
		this.name = name;
		this.type = "";
		this.required = false;
		this.options = {
			stringEnums: []
		};
	};

	$scope.createField = function(){
		var name = prompt("What's the name of the field");
		$scope.fieldArr[name] = new $scope.fieldConstructor(name);
		console.log($scope.fieldArr);
	};

	// $scope.deleteField = function(name){
	// 	console.log('called with ', name);
	// 	$scope.fieldArr.forEach(obj, index){
	// 		if(obj.formdata.name == name){
	// 			$scope.fieldArr.splice(index, 1);
	// 		}
	// 	}
	// }
	
	$scope.$on('deleteField', function(event, field){
		 $scope.fieldArr.forEach(function(obj, index){
		 		if(obj.formdata.name === field.name){
					$scope.fieldArr.splice(index, 1);
				}
		 })
	});
});