'use strict';

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        $ionicConfigProvider.backButton.previousTitleText(true);

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/signup.html',
                controller: ''
            })
            .state('dash', {
                url: '/dash',
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            })
            .state('chats', {
                url: '/chats',
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
            })
            .state('chat-detail', {
                url: '/chats/:chatId',
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
            })
            .state('account', {
                url: '/account',
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/account');

    })
    .directive('errSrc', function() {
        return {
            link: function(scope, element, attrs) {

                scope.$watch(function() {
                    return attrs['ngSrc'];
                }, function(value) {
                    if (!value) {
                        element.attr('src', attrs.errSrc);
                    }
                });

                element.bind('error', function() {
                    element.attr('src', attrs.errSrc);
                });
            }
        };
    });
