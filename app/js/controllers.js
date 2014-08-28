'use strict';

/* Controllers */

angular.module('skySquash.controllers', [])
    .controller('IndexCtrl', ['$scope', 'auth', function($scope, auth) {
        $scope.auth = auth;
    }])
    .controller('BookingsCtrl', ['$scope', '$firebase', 'auth', 'users', function($scope, $firebase, auth, users) {
        var ref = new Firebase('https://sky-squash.firebaseio.com/bookings');
        var sync = $firebase(ref);

        $scope.bookings = sync.$asArray();
        $scope.new = {};

        $scope.create = function () {
            $scope.new.status = 'open';
            $scope.bookings.$add($scope.new);
            $scope.new = {};
        };

        $scope.playerName = function (id) {
            return users.get(id).displayName;
        };

        $scope.showJoin = function (booking) {
            if (!booking.players) {
                return true;
            }

            return booking.players.indexOf(auth.user.uid) === -1;
        };

        $scope.join = function (booking) {
            if (booking.players && booking.players.indexOf(auth.user.uid) > -1) {
                return;
            }

            booking.players = booking.players || [];
            booking.players.push(auth.user.uid);
            $scope.bookings.$save(booking);
        };
    }])
    .controller('UserCtrl', ['$scope', 'auth', function ($scope, auth) {
        auth.$getCurrentUser().then(function (user) {
            $scope.user = user;
        });

        $scope.logout = auth.$logout;
    }]);
