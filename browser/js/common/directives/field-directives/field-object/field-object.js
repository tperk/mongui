app.directive('fieldObject', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '='
        },
        templateUrl: 'js/common/directives/field-directives/field-object/field-object.html',
        link: function (scope) {
        	
        	scope.subFields = [];
        	
        	scope.addSubField = function(){
        	 	var value = prompt("please enter a name");
        	 	scope.props[value] = {name: value, type: "", options: {stringEnums: []}};
        	 	
        	};
        }
   };
});