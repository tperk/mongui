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
	
	$scope.createField = function(){
		fieldFactory.createField({}).then(function(field){
			$scope.fields.push(field);
		});
	};

	$scope.deleteField = function(field){
		// console.log("field.parent is ", field.parent)
		// if(field.parent){
		// 	fieldFactory.getFieldById(field.parent).then(function(parent){
		// 		console.log("FOUND PARENT with children", parent)
		// 		 parent.children = _.reject(parent.children, function(obj){
		// 			return obj._id === field._id
		// 		});
		// 		 console.log("after map ", parent.children);
		// 		 return parent;
		// 	}).then(function(parent){
		// 		console.log("new parent", parent);
		// 		return $scope.saveField(parent._id, parent);
		// 	});
		// }

		fieldFactory.deleteFieldById(field._id).then(function (response){
			$scope.fields = _.reject($scope.fields, function(obj){
				return obj._id === field._id;
			});
		});

	};

	$scope.saveField = function(id, field){
		$scope.saving = true;
		return fieldFactory.editFieldById(id, field).then(function (response){
			$scope.saving = false;
			return response;
		});
	};

	$scope.createSubField = function(parent){
		fieldFactory.createField({parent: parent._id}).then(function(child){
			var justIds = parent.children.map(function(child){
				if(typeof child == 'object'){
					return child._id;
				} 
				else {
					return child
				}
			})
			console.log('just ids = ', justIds);
			parent.children = justIds;
			console.log("parent before push ", parent.children);
			parent.children.push(child._id);
			console.log("parent after push ", parent.children);
			$scope.saveField(parent._id, parent).then(function(response){
				$scope.setAllFields();
			});
		})
	};

	$scope.setAllFields();
	// fieldFactory.createField({name: "test", required: false});

	

});