app.directive('fieldNumber', function ($state) {
	return {
        restrict: 'E',
        scope: {
        	props: '='
        },
        templateUrl: 'js/common/directives/field-directives/field-number/field-number.html',
        link: function (scope) {

        }
   };
});