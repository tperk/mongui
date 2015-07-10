app.directive('function', function ($state, $rootScope) {
	return {
        restrict: 'E',
        scope: {
            func: "=",
            fields: "=",
            deletebyid: "&",
            savefunction: "&",
            saving: "=",
            typechangeclear: '&',
            schemas: "=",
            currentschema: "="
        },
        templateUrl: 'js/common/directives/function/function.html',
        link: function (scope, attrs) {
            scope.types = ["Getter/Setter", "Hook", "Method", "Static", "Virtual"];
            scope.functionChange = function(){
                scope.$emit('functionsChanged', scope.func._id);
            };
        }
   };
});
