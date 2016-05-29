angular.module('starter.services', [])
    .factory('netWorkFactory', function($http) {
        return {
            getIPAddress: function() {
                return $http.get('http://ipv4.myexternalip.com/json').then(function(result) {
                    console.log('result: ', result.data);
                    return result.data;
                }, function(e) {
                    console.log('getIPAddress Err: ', e);
                });
            }
        };
    })
    .factory('Chats', function() {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'img/ben.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'img/max.png'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'img/adam.jpg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'img/perry.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'img/mike.png'
        }];

        return {
            all: function() {
                return chats;
            },
            remove: function(chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function(chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    })
    .factory('MediaCustom', ['$window', function($window) {
        console.log('MediaCustom');
        if ($window.MediaCustom) {
            return $window.MediaCustom;
        }
    }])
    .factory('appSocket', function(socketFactory, API_URL) {
        var myIoSocket = io.connect(API_URL);
        var socket = socketFactory({
            ioSocket: myIoSocket
        });
        return socket;
    });
