app.directive('fieldObjectid', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '=',
            schemas: "=",
            currentschema: "="
        },
        templateUrl: 'js/common/directives/field-directives/field-objectid/field-objectid.html',
        link: function (scope, attrs) {
        }
   };


});