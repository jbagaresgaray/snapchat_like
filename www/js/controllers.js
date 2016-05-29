angular.module('starter.controllers', [])
    .controller('LoginCtrl', function($scope, $window, $timeout, $ionicPlatform) {

        $scope.loadBackgroundCamera = function() {
            var tapEnabled = false;
            var dragEnabled = true;
            var toBack = true;

            var login_height = document.getElementById('btn-login').clientHeight;

            var dev_width = $window.innerWidth;
            var dev_height = ($window.innerHeight - login_height);

            $ionicPlatform.ready(function() {
                console.log('iLoginCtrl onic is ready');
                if (window.cordova && window.cordova.plugins) {
                    console.log('iLoginCtrl cordova plugins');
                    cordova.plugins.camerapreview.startCamera({
                        x: 0,
                        y: 0,
                        width: dev_width,
                        height: dev_height
                    }, "front", tapEnabled, dragEnabled, toBack);
                }
            });
        };

        $scope.$on("$ionicView.enter", function(scopes, states) {
            console.log('$ionicView.enter');
            // $scope.loadBackgroundCamera();
            if (window.cordova && window.cordova.plugins) {
                // cordova.plugins.camerapreview.stopCamera();
                cordova.plugins.camerapreview.show();
            }
        });

        $scope.$on("$ionicView.leave", function(scopes, states) {
            if (window.cordova && window.cordova.plugins) {
                // cordova.plugins.camerapreview.stopCamera();
                cordova.plugins.camerapreview.hide();
            }
        });

    })
    .controller('DashCtrl', function($scope, $cordovaDevice, $cordovaGeolocation,netWorkFactory) {
        $scope.$on("$ionicView.enter", function(scopes, states) {
            console.log('$ionicView.enter');

            $scope.item = {};

            $scope.item.device = $cordovaDevice.getName();
            $scope.item.model = $cordovaDevice.getModel();
            $scope.item.platform = $cordovaDevice.getPlatform();
            $scope.item.deviceId = $cordovaDevice.getUUID();
            $scope.item.manufacturer = $cordovaDevice.getManufacturer();
            $scope.item.version = $cordovaDevice.getVersion();

            if (window.MacAddress) {
                window.MacAddress.getMacAddress(
                    function(macAddress) {
                        $scope.item.macAddress = macAddress;
                    },
                    function(error) {
                        console.log('device MacAddress err: ', error);
                    }
                );
            }else{
                $scope.item.macAddress = '';
            }

            if (window.networkinterface) {
                networkinterface.getIPAddress(function(ipAddress) {
                    $scope.item.ipAddress = ipAddress || '';
                }, function(error) {
                    console.log('device ipAddress err: ', error);
                });
            }else{
                netWorkFactory.getIPAddress().then(function(data){
                    $scope.item.ipAddress = data.ip;
                });
            }

            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    $scope.item.latitude = position.coords.latitude
                    $scope.item.longitude = position.coords.longitude

                    appSocket.emit('socket', $scope.item);
                    console.log('device: ', $scope.item);
                }, function(err) {
                    console.log('error $cordovaGeolocation: ', err);
                });
        });


        $scope.$on("$ionicView.leave", function(scopes, states) {
            console.log('$ionicView.leave - socket: disconnect')
            appSocket.emit('disconnect',$scope.item);
        });

    })
    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })
    .controller('AccountCtrl', function($scope, $window, $ionicPlatform) {
        // $scope.loadBackgroundCamera = function() {
        //     var tapEnabled = false;
        //     var dragEnabled = true;
        //     var toBack = true;

        //     var login_height = document.getElementById('login').clientHeight;
        //     var signup_height = document.getElementById('signup').clientHeight;

        //     var dev_width = $window.innerWidth;
        //     var dev_height = ($window.innerHeight - (login_height + signup_height));

        //     $ionicPlatform.ready(function() {
        //         console.log('AccountCtrl ionic is ready');
        //         if (window.cordova && window.cordova.plugins) {
        //             console.log('AccountCtrl cordova plugins');
        //             cordova.plugins.camerapreview.startCamera({
        //                 x: 0,
        //                 y: 0,
        //                 width: dev_width,
        //                 height: dev_height
        //             }, "front", tapEnabled, dragEnabled, toBack);
        //         }
        //     });
        // }

        // $scope.$on("$ionicView.enter", function(scopes, states) {
        //     console.log('$ionicView.enter');
        //     // $scope.loadBackgroundCamera();
        //     if (window.cordova && window.cordova.plugins) {
        //         // cordova.plugins.camerapreview.stopCamera();
        //         cordova.plugins.camerapreview.show();
        //     }
        // });

        // $scope.$on("$ionicView.leave", function(scopes, states) {
        //     if (window.cordova && window.cordova.plugins) {
        //         // cordova.plugins.camerapreview.stopCamera();
        //         cordova.plugins.camerapreview.hide();
        //     }
        // });
    });
