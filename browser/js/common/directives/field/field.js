app.directive('field', function ($state) {
	return {
        restrict: 'E',
        scope: {
            formdata: "="
        },
        templateUrl: 'js/common/directives/field/field.html',
        link: function (scope) {
    		scope.types = ["String", "Number", "Date", "Buffer", "Boolean", "Mixed", "Object", "Objectid", "Array", "Schema"];
    		scope.field = {
<<<<<<< HEAD
    			name: "",
    			type: "",
    			required: false,
    			stringEnums: []
=======

>>>>>>> 7fb39c247122631bc2003dba7dca995a5a9b32b2
    		};
        }
   };
});