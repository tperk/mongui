//
//
//
// NOTE THAT THE CALENDAR DIRECTIVE IS NOT WORKING 
// it doesn't update the 'props'
// and thus does not change fieldstatus to edited

app.directive('fieldDate', function ($state) {
	return {
        restrict: 'E',
        scope: {
            props: '=',
            fieldchange: '&'
        },
        templateUrl: 'js/common/directives/field-directives/field-date/field-date.html',
        link: function (scope) {

        }
   };
});