app.directive('field', function ($state, $rootScope) {
	return {
        restrict: 'E',
        scope: {
            formdata: "=",
            deletefield: "&"
        },
        templateUrl: 'js/common/directives/field/field.html',
        link: function (scope) {
    		scope.types = ["String", "Number", "Date", "Buffer", "Boolean", "Mixed", "Object", "Objectid", "Array", "Schema"];
    		scope.formdata = scope.field = {
                name: "",
                type: "",
                required: false,
                options: {stringEnums: []}
    		};
            scope.test = "test"
            scope.clearOptions = function(){
                scope.field.options = {stringEnums: []};
            };
            scope.deleteField = function(field){
                $rootScope.$broadcast('deleteField', scope.field);
            };
        }
   };
});