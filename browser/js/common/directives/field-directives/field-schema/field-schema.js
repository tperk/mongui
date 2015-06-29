app.directive('fieldSchema', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '='
        },
        templateUrl: 'js/common/directives/field-directives/field-schema/field-schema.html',
        link: function (scope) {

        }
   };
});