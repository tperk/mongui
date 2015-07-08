app.directive('functionVirtual', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '=',
            functionchange: '&'
        },
        templateUrl: 'js/common/directives/function-directives/function-virtual/function-virtual.html',
        link: function (scope) {

        }
   };
});