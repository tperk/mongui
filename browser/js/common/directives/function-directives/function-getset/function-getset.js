app.directive('functionGetset', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '=',
            functionchange: '&',
            fields: '='
        },
        templateUrl: 'js/common/directives/function-directives/function-getset/function-getset.html',
        link: function (scope) {

        }
   };
});