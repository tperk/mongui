app.directive('function', function ($state, $rootScope) {
	return {
        restrict: 'E',
        scope: {
            function: "=",
            deletebyid: "&",
            savefunction: "&",
            saving: "=",
            typechangeclear: '&',
            schemas: "=",
            currentschema: "="
        },
        templateUrl: 'js/common/directives/function/function.html',
        link: function (scope) {
            scope.types = ["Getter/Setter", "Hook", "Method", "Static", "Virtual"];
            scope.functionChange = function(){
                scope.$emit('functionChanged', scope.function._id);
            };
        }
   };
});
