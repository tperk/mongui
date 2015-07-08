app.directive('fieldMixed', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '=',
            fieldchange: '&'
        },
        templateUrl: 'js/common/directives/field-directives/field-mixed/field-mixed.html',
        link: function (scope) {

        }
   };
});