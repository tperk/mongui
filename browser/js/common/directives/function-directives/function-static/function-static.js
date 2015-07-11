app.directive('functionStatic', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '=',
            functionchange: '&'
        },
        templateUrl: 'js/common/directives/function-directives/function-static/function-static.html',
        link: function (scope) {

        }
   };
});