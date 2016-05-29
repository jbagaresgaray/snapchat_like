'use strict';

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services',
        'btford.socket-io',
        'ngCordova'
    ])
    .constant('API_URL', 'http://localhost:3001')
    // .constant('API_URL', 'http://wifi-self-healing.herokuapp.com/') // PRODUCTION
    .constant('API_VERSION', '/api/1.0/')
    .run(function($rootScope, $ionicPlatform, API_URL, $cordovaNetwork, $cordovaDevice, $cordovaGeolocation) {
        $rootScope.item = {};

        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            if (!window.socketIo) {
                window.socketIo = window.io.connect(API_URL + '/?token=null');
            } else {
                window.io.disconnect();
                window.socketIo = window.io.connect(API_URL + '/?token=null');
            }

            $rootScope.online = $cordovaNetwork.isOnline();


            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    $rootScope.item.latitude = position.coords.latitude
                    $rootScope.item.longitude = position.coords.longitude
                }, function(err) {
                    console.log('error $cordovaGeolocation: ', err);
                });

            window.MacAddress.getMacAddress(
                function(macAddress) {
                    $rootScope.item.macAddress = macAddress;
                },
                function(error) {
                    console.log('device MacAddress err: ', error);
                }
            );

            $rootScope.item.device = $cordovaDevice.getName();
            $rootScope.item.model = $cordovaDevice.getModel();
            $rootScope.item.platform = $cordovaDevice.getPlatform();
            $rootScope.item.deviceId = $cordovaDevice.getUUID();
            $rootScope.item.manufacturer = $cordovaDevice.getManufacturer();
            $rootScope.item.version = $cordovaDevice.getVersion();

            console.log('run $scope.item: ', $rootScope.item);
            socketIo.emit('socket', $scope.item);

            $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                var onlineState = networkState;

                $rootScope.$apply(function() {
                    $rootScope.online = true;
                    $rootScope.item.online = true;
                    socketIo.emit('networkState', $rootScope.item);
                });

            });

            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                var offlineState = networkState;

                $rootScope.$apply(function() {
                    $rootScope.online = false;
                    $rootScope.item.online = false;
                    socketIo.emit('networkState', $rootScope.item);
                    socketIo.emit('networkState', $rootScope.item);
                });
            });


            socketIo.on('server:response',function(response){
                console.log('server:response after ping: ', response);
                socketIo.emit('device:ping', $rootScope.item);
            });
        });
    })
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

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
        $urlRouterProvider.otherwise('/dash');

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
