'use strict';

/* Controllers */

angular.module('skySquash.controllers', [])
    .controller('AppCtrl', ['$scope', 'auth', function($scope, auth) {
        $scope.auth = auth;
    }])
    .controller('BookingsCtrl', [
        '$scope',
        '$firebase',
        'auth',
        'user',
        'transactions',
        '$modal',
    function($scope, $firebase, auth, user, transactions, $modal) {
        var ref = new Firebase('https://sky-squash.firebaseio.com/bookings');
        var sync = $firebase(ref);

        $scope.bookings = sync.$asArray();
        $scope.new = {};

        $scope.create = function () {
            $scope.new.status = 'Open';
            $scope.bookings.$add($scope.new);
            $scope.new = {};
        };

        $scope.showJoin = function (booking) {
            if (!booking.players) {
                return true;
            }

            return booking.players.indexOf(user.$sync.displayName) === -1;
        };

        $scope.join = function (booking) {
            if (booking.players && booking.players.indexOf(user.$sync.$id) > -1) {
                return;
            }

            booking.players = booking.players || [];
            booking.players.push(user.$sync.$id);
            $scope.bookings.$save(booking);
        };

        $scope.confirm = function (booking) {
            var modal = $modal.open({
                templateUrl: 'confirmBooking.html',
                resolve: {
                    booking: function () {
                        return booking;
                    }
                },
                controller: ['$scope', '$modalInstance', 'booking', function ($scope, $instance, booking) {
                    $scope.booking = booking;

                    $scope.ok = function () {
                        $instance.close();
                    };

                    $scope.cancel = function () {
                        $instance.dismiss('cancel');
                    };
                }]
            });
            
            modal.result.then(function() {
                var costPerPlayer = booking.cost / booking.players.length;

                transactions.$sync.$add({
                    type: 'credit',
                    value: costPerPlayer,
                    booking: booking.$id
                });

                //booking.status = 'Confirmed';
                $scope.bookings.$save(booking);
            });
        };
    }])
    .controller('UserCtrl', ['$scope', 'user', 'transactions', 'auth', function ($scope, user, transactions, auth) {
        user.$loaded().then(function (user) {
            user.$sync.$bindTo($scope, 'user'); 
        });

        transactions.$loaded().then(function () {
            $scope.balance = balance(transactions.$sync);

            transactions.$sync.$watch(function () {
                console.log('watch', transactions.$sync);
                $scope.balance = balance(transactions.$sync);
            });
        });


        function balance(transactions) {
            return transactions.reduce(function (carry, item) {
                var value = item.value;
                if (item.type === 'credit') {
                    value *= -1;
                }

                carry += value;
                return carry;
            }, 0);
        };

        $scope.logout = auth.$logout;
    }]);
