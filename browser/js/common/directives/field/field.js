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
    			name: "",
    			type: "",
    			required: false,
    			stringEnums: []

    		};
        }
   };
});