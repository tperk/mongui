app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('engine', {
        url: '/engine',
        controller: 'EngineController',
        templateUrl: 'js/engine/engine.html'
    });

});

app.controller('EngineController', function ($scope) {
	$scope.fieldArr = [{}];
	$scope.createField = function(){
		$scope.fieldArr.push({});
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