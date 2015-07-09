app.directive('functionMethod', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '=',
            functionchange: '&'
        },
        templateUrl: 'js/common/directives/function-directives/function-method/function-method.html',
        link: function (scope) {

        }
   };
});