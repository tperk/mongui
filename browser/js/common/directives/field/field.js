app.directive('field', function ($state, $rootScope) {
	return {
        restrict: 'E',
        scope: {
            field: "=",
            deletebyid: "&",
            savefield: "&",
            saving: "=",
            subfield: '&'
        },
        templateUrl: 'js/common/directives/field/field.html',
        link: function (scope) {
            scope.types = ["String", "Number", "Date", "Buffer", "Boolean", "Mixed", "Objectid", "Array", "Nested"];

            scope.clearOptions = function(){
                scope.field.typeOptions = {stringEnums: [], array: false};
            };


        }
   };
});