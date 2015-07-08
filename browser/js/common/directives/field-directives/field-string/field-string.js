app.directive('fieldString', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '=',
            fieldchange: '&'
        },
        templateUrl: 'js/common/directives/field-directives/field-string/field-string.html',
        link: function (scope) {

        }
   };
});