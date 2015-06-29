app.directive('fieldDate', function ($state) {
	return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/field-directives/field-date/field-date.html',
        link: function (scope) {
    		scope.field = {

    		};
        }
   };
});