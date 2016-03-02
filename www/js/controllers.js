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
    var app = {
      initialize: function() {
        this.bindEvents();
      },
      bindEvents: function() {
        document.getElementById('startCameraButton').addEventListener('mousedown', this.onStartCamera, false);
        document.getElementById('startCameraAnotherPosButton').addEventListener('mousedown', this.onStartCameraAnotherPos, false);

        document.getElementById('stopCameraButton').addEventListener('mousedown', this.onStopCamera, false);
        document.getElementById('takePictureButton').addEventListener('mousedown', this.onTakePicture, false);
        document.getElementById('switchCameraButton').addEventListener('mousedown', this.onSwitchCamera, false);
        document.getElementById('showButton').addEventListener('mousedown', this.onShow, false);
        document.getElementById('hideButton').addEventListener('mousedown', this.onHide, false);
        document.getElementById('colorEffectCombo').addEventListener('change', this.onColorEffectChanged, false);
        //window.addEventListener('orientationchange', this.onStopCamera, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
      },
      onStartCamera: function() {
        var tapEnabled = true;
        var dragEnabled = true;
        var toBack = true;
        cordova.plugins.camerapreview.startCamera({
          x: 0,
          y: 50,
          width: 300,
          height: 300
        }, "front", tapEnabled, dragEnabled, toBack);
      },
      onStartCameraAnotherPos: function() {
        var tapEnabled = true;
        var dragEnabled = true;
        var toBack = false;
        cordova.plugins.camerapreview.startCamera({
          x: 200,
          y: 0,
          width: 100,
          height: 150
        }, "front", tapEnabled, dragEnabled, toBack);
      },
      onStopCamera: function() {
        cordova.plugins.camerapreview.stopCamera();
      },
      onTakePicture: function() {
        cordova.plugins.camerapreview.takePicture({
          maxWidth: 640,
          maxHeight: 640
        });
      },
      onSwitchCamera: function() {
        cordova.plugins.camerapreview.switchCamera();
      },
      onShow: function() {
        cordova.plugins.camerapreview.show();
      },
      onHide: function() {
        cordova.plugins.camerapreview.hide();
      },
      onColorEffectChanged: function() {
        var effect = document.getElementById('colorEffectCombo').value;
        cordova.plugins.camerapreview.setColorEffect(effect);
      },

      // deviceready Event Handler
      onDeviceReady: function() {
        //on picture
        cordova.plugins.camerapreview.setOnPictureTakenHandler(function(result) {
          document.getElementById('originalPicture').src = result[0]; //originalPicturePath;
          document.getElementById('previewPicture').src = result[1]; //previewPicturePath;
        });
      }
    };



    $scope.$on("$ionicView.enter", function(scopes, states) {
      if (window.cordova && window.cordova.plugins) {
        app.initialize();
      }
    });

    $scope.$on("$ionicView.leave", function(scopes, states) {
      if (window.cordova && window.cordova.plugins) {
        cordova.plugins.camerapreview.stopCamera();
      }
    });
  })
  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })
  .controller('AccountCtrl', function($scope, $window) {

    $scope.$on("$ionicView.enter", function(scopes, states) {
      var tapEnabled = false;
      var dragEnabled = true;
      var toBack = true;

      var login_height = document.getElementById('login').clientHeight;
      var signup_height = document.getElementById('signup').clientHeight;

      var dev_width = $window.innerWidth;
      var dev_height = ($window.innerHeight - (login_height + signup_height));

      if (window.cordova && window.cordova.plugins) {
          
        cordova.plugins.camerapreview.setOnPictureTakenHandler(function(result) {
          document.getElementById('originalPicture').src = result[0]; //originalPicturePath;
          document.getElementById('previewPicture').src = result[1]; //previewPicturePath;
        });
          
        cordova.plugins.camerapreview.startCamera({
          x: 0,
          y: 0,
          width: dev_width,
          height: dev_height
        }, "front", tapEnabled, dragEnabled, toBack);
      }
    });

    $scope.$on("$ionicView.leave", function(scopes, states) {
      if (window.cordova && window.cordova.plugins) {
        cordova.plugins.camerapreview.stopCamera();
      }
    });


  });
