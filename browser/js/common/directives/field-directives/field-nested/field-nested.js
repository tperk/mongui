app.directive('fieldNested', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '=',
            subfield: '&',
            children: '='
        },
        templateUrl: 'js/common/directives/field-directives/field-nested/field-nested.html',
        link: function (scope) {

        }
   };
});