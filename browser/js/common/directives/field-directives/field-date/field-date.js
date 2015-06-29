app.directive('fieldDate', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '='
        },
        templateUrl: 'js/common/directives/field-directives/field-date/field-date.html',
        link: function (scope) {

        }
   };
});