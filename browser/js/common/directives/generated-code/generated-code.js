app.directive('generatedCode', function ($state) {
    return {
        restrict: 'E',
        scope: {
            parsedString: "=",
            formdata: "="
        },
        templateUrl: 'js/common/directives/generated-code/generated-code.html',
        link: function (scope) {
            scope.generatedCode = "";
            scope.name = 'ben';
            scope.generateCode = function(){
                scope.generatedCode = 
                `hello ${scope.name} this is a parsed string: ${scope.parsedString}`; 
            };
        }
   };
});