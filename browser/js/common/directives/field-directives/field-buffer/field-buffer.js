app.directive('fieldBuffer', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '='
        },
        templateUrl: 'js/common/directives/field-directives/field-buffer/field-buffer.html',
        link: function (scope) {

        }
   };
});