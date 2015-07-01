app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('engine', {
        url: '/engine',
        controller: 'EngineController',
        templateUrl: 'js/engine/engine.html'
    });

});

app.controller('EngineController', function ($scope, fieldFactory) {
	$scope.saving = false;

	$scope.setAllFields = function(){
		fieldFactory.getAllFields().then(function(fields){
			$scope.fields = fields;
		});
	};
	
	//schemaId will be accessable as $stateParams.id
	$scope.createField = function(schemaId){
		fieldFactory.createField({}, schemaId).then(function(field){
			$scope.fields.push(field);
		});
	};

	$scope.deleteField = function(field){
		fieldFactory.deleteFieldById(field._id).then(function (response){
			// $scope.fields = _.reject($scope.fields, function(obj){
			// 	return obj._id === field._id;
			// });
			$scope.setAllFields();
		});

	};

	$scope.saveField = function(id, field){
		$scope.saving = true;
		var fieldCopy = field;
		var justIds = field.children.map(function(child){
			if(typeof child === 'object'){return child._id;} 
			else {return child;}
		});
		fieldCopy.children = justIds;
		return fieldFactory.editFieldById(id, fieldCopy).then(function (response){
			$scope.saving = false;
			$scope.setAllFields();
			return;
		});
	};

	$scope.createSubField = function(parent){
		console.log("should be []", parent.parents);
		var copyOfParents = parent.parents.slice();
		copyOfParents.push(parent._id);
		console.log("parent is ", parent);
		fieldFactory.createField({parents: copyOfParents}).then(function(child){
			var justIds = _.map(parent.children, function(child){
				if(typeof child === 'object'){
					return child._id;
				} 
				else {
					return child;
				}
			});
			parent.children = justIds;
			parent.children.push(child._id);
			$scope.saveField(parent._id, parent);
		});
	};

    $scope.typeChangeClear = function(field){
       field.typeOptions = {stringEnums: [], array: false};
  		$scope.saveField(field._id, field).then(function(result){
    		if(field.children.length){
    			field.children.forEach(function(child){
    				$scope.deleteField({_id: child});
    			});
    		}
  		});
    };

	$scope.setAllFields();
	// fieldFactory.createField({name: "test", required: false});

	

});