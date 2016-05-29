'use strict';

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services',
        'btford.socket-io',
        'ngCordova'
    ])
    .constant('API_URL', 'http://localhost:3001')
    // .constant('API_URL', 'http://wifi-self-healing.herokuapp.com/') // PRODUCTION
    .constant('API_VERSION', '/api/1.0/')
    .run(function($rootScope, $ionicPlatform, API_URL, $cordovaNetwork, $cordovaDevice, $cordovaGeolocation, netWorkFactory, appSocket, $interval) {
        $rootScope.item = {};
        var promise;
        var startTime;

        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            $rootScope.online = $cordovaNetwork.isOnline();

            $rootScope.item.device = $cordovaDevice.getName();
            $rootScope.item.model = $cordovaDevice.getModel();
            $rootScope.item.platform = $cordovaDevice.getPlatform();
            $rootScope.item.deviceId = $cordovaDevice.getUUID();
            $rootScope.item.manufacturer = $cordovaDevice.getManufacturer();
            $rootScope.item.version = $cordovaDevice.getVersion();

            if (window.MacAddress) {
                window.MacAddress.getMacAddress(
                    function(macAddress) {
                        $rootScope.item.macAddress = macAddress;
                    },
                    function(error) {
                        console.log('device MacAddress err: ', error);
                    }
                );
            } else {
                $rootScope.item.macAddress = '';
            }

            if (window.networkinterface) {
                networkinterface.getIPAddress(function(ipAddress) {
                    $scope.item.ipAddress = ipAddress || '';
                }, function(error) {
                    console.log('device ipAddress err: ', error);
                });
            } else {
                netWorkFactory.getIPAddress().then(function(data) {
                    $rootScope.item.ipAddress = data.ip;
                });
            }

            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    $rootScope.item.latitude = position.coords.latitude
                    $rootScope.item.longitude = position.coords.longitude

                    console.log('device: ', $rootScope.item);

                    appSocket.emit('socket', $rootScope.item);
                }, function(err) {
                    console.log('error $cordovaGeolocation: ', err);
                });
        });

        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            var onlineState = networkState;

            $rootScope.$apply(function() {
                $rootScope.online = true;
                $rootScope.item.online = true;

                appSocket.emit('networkState', $rootScope.item);
            });

        });

        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
            var offlineState = networkState;

            $rootScope.$apply(function() {
                $rootScope.online = false;
                $rootScope.item.online = false;

                appSocket.emit('networkState', $rootScope.item);
            });
        });

        promise = $interval(function() {
            startTime = Date.now();
            console.log('device:ping:send');
            $rootScope.item.startTime = startTime;
            appSocket.emit('device:ping:send', $rootScope.item);
        }, 3000);


        appSocket.on('device:ping:send', function(device) {
            console.log('device ping: ', device);
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
