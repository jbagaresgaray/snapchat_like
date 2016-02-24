angular.module('starter.controllers', [])
    .controller('LoginCtrl', function($scope, $window, $timeout, $sce) {

        function getPhoneGapPath() {
            var path = window.location.pathname;
            path = path.substr(path, path.length - 10);
            return 'file://' + path;
        }

        var video = document.getElementById('video'),
            output = document.getElementById('output');

        $scope.videourl = $sce.trustAsResourceUrl(getPhoneGapPath() + 'img/big_buck_bunny.mp4');

        video.addEventListener('loadeddata', function(e) {
            // for some reason we need a delay to successfully retrieve metadata
            $timeout(function() {
                output.innerHTML += 'src = ' + e.target.src + '<br/>';
                output.innerHTML += 'duration = ' + e.target.duration + '<br/>';
                output.innerHTML += 'videoWidth = ' + e.target.videoWidth + '<br/>';
                output.innerHTML += 'videoHeight = ' + e.target.videoHeight + '<br/>';
            }, 200);
        });


        $scope.takepic = function() {
            if ($window.MediaCustom) {
                $window.MediaCustom.show(function(data) {
                    video.src = data;
                    $window.MediaCustom.hide();
                }, function(e) {
                    //window.alert('MediaCustom.error: ' + JSON.stringify(e));
                    $window.MediaCustom.hide();
                    navigator.camera.getPicture(function(data) {
                        //window.alert('getPicture.success: ' + JSON.stringify(data));
                        video.src = data;
                    }, function(e) {
                        $window.alert('getPicture.error: ' + JSON.stringify(e));
                    }, {
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        mediaType: Camera.MediaType.VIDEO,
                        destinationType: Camera.DestinationType.FILE_URI
                    });
                });
            } else {
                $window.alert('MediaCustom feature not supported');
            }
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
        $scope.settings = {
            enableFriends: true
        };
    });
