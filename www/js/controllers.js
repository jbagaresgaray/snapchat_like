angular.module('starter.controllers', [])
    .controller('LoginCtrl', function($scope, $window, $timeout, $sce) {

        $scope.takepic = function() {
            navigator.customCamera.getPicture("latest_scan.png",
                function(imagePath) {
                    alert("File path: " + imagePath);
                    $timeout(function() {
                        $scope.$apply(function() {
                            $scope.imagePath = imagePath;
                        });
                    }, 100);
                },
                function(error) {
                    alert(error);
                }, {
                    quality: 100,
                    targetWidth: 1000,
                    targetHeight: 1000
                });
        };

    })
    .controller('DashCtrl', function($scope) {})
    .controller('ChatsCtrl', function($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        };
    })
    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })
    .controller('AccountCtrl', function($scope) {
        var tapEnabled = false;
        var dragEnabled = false;
        var toBack = false;
        if (window.cordova && window.cordova.plugins) {
            cordova.plugins.camerapreview.startCamera({ x: 200, y: 0, width: 300, height: 500 }, "front", tapEnabled, dragEnabled, toBack);
        }
    });
