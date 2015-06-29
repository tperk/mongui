app.directive('fieldNumber', function ($state) {
	return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/field-directives/field-number/field-number.html',
        link: function (scope) {
        		scope.field = {

        		};
        }
   };
});