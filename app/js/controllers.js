'use strict';

/* Controllers */

angular.module('skySquash.controllers', [])
    .controller('IndexCtrl', ['$scope', '$firebase', function($scope, $firebase) {
    }])
    .controller('BookingsCtrl', ['$scope', '$firebase', function($scope, $firebase) {
        var ref = new Firebase('https://sky-squash.firebaseio.com/bookings');
        var sync = $firebase(ref);

        $scope.bookings = sync.$asArray();
        $scope.new = {};

        $scope.create = function () {
            $scope.new.status = 'open';
            $scope.bookings.$add($scope.new);
            $scope.new = {};
        };
    }]);
