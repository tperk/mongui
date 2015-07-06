'use strict';
window.app = angular.module('FullstackGeneratedApp', ['ui.router', 'ui.bootstrap', 'fsaPreBuilt', 'ngMaterial', 'ncy-angular-breadcrumb', 'materialDatePicker']);

app.config(function ($urlRouterProvider, $locationProvider, $mdThemingProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
        // Extend the red theme with a few different colors
        var monguiRedMap = $mdThemingProvider.extendPalette('red', {
            '500': 'FB4F4F'
        });
        var monguiBlueMap = $mdThemingProvider.extendPalette('blue', {
            '500': '6CC0E5'
        });
        var monguiYellowMap = $mdThemingProvider.extendPalette('yellow', {
            '500': 'FBC93D'
        });
        // Register the new color palette map with the name <code>neonRed</code>
        $mdThemingProvider.definePalette('monguiRed', monguiRedMap);
        $mdThemingProvider.definePalette('monguiBlue', monguiBlueMap);
        $mdThemingProvider.definePalette('monguiYellow', monguiYellowMap);
        // Use that theme for the primary intentions
        $mdThemingProvider.theme('default')
            .primaryPalette('neonRed')

    $mdThemingProvider.theme('default')
        .primaryPalette("monguiRed")
        .accentPalette('monguiBlue')
        .warnPalette('monguiYellow')
        .backgroundPalette('grey', {
            'default': '900'
        })
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('home');
            }
        });

    });

});