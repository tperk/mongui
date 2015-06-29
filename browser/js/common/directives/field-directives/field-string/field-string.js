app.directive('fieldString', function ($state) {
	return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/field-string/field-string.html',
        link: function (scope) {
        		scope.field = {
        			stringEnums: []
        		};
        }
   };
});