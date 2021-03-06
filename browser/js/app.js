'use strict';
window.app = angular.module('Mongui', ['ui.router', 'ui.bootstrap', 'fsaPreBuilt', 'ngMaterial', 'ncy-angular-breadcrumb', 'materialDatePicker', 'hljs']);

app.config(function ($urlRouterProvider, $locationProvider, $mdThemingProvider, hljsServiceProvider) {
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

    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'hue-1': '400',
            'hue-2': '600',
            'hue-3': '700'
        })
        .accentPalette('green')
        .warnPalette('orange');
    hljsServiceProvider.setOptions({

    });

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

        if(toState.name === 'home'){
            AuthService.getLoggedInUser().then(function (user) {
                if (user) {
                    $state.go('projects');
                }
            });
        }

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