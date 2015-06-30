app.directive('field', function ($state, $rootScope) {
	return {
        restrict: 'E',
        scope: {
            field: "=",
            deletebyid: "&",
        },
        templateUrl: 'js/common/directives/field/field.html',
        link: function (scope) {
            scope.types = ["String", "Number", "Date", "Buffer", "Boolean", "Mixed", "Object", "Objectid", "Array", "Schema"];

            scope.clearOptions = function(){
                scope.field.options = {stringEnums: []};
            };


        }
   };
});