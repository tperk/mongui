app.directive('fieldBoolean', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '='
        },
        templateUrl: 'js/common/directives/field-directives/field-boolean/field-boolean.html',
        link: function (scope) {

        }
   };
});