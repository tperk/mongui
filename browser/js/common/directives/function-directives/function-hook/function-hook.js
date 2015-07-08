app.directive('functionHook', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '=',
            functionchange: '&'
        },
        templateUrl: 'js/common/directives/function-directives/function-hook/function-hook.html',
        link: function (scope) {

        }
   };
});