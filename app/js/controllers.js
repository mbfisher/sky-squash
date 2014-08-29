'use strict';

/* Controllers */

angular.module('skySquash.controllers', [])
    .controller('AppCtrl', ['$scope', 'auth', function($scope, auth) {
        $scope.auth = auth;
        /*$scope.login = function (provider) {
            auth.$login(provider).then(function () {
                console.log(arguments);
            });
        };*/
    }])
    .controller('BookingsCtrl', [
        '$scope',
        '$firebase',
        'auth',
        'transactions',
        '$modal',
    function($scope, $firebase, auth, transactions, $modal) {
        var user = auth.user;

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

            return booking.players.indexOf(user.displayName) === -1;
        };

        $scope.join = function (booking) {
            if (booking.players && booking.players.indexOf(user.uid) > -1) {
                return;
            }

            booking.players = booking.players || [];
            booking.players.push(user.uid);
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
                    booking: booking.$id,
                    timestamp: new Date().getTime()
                });

                booking.status = 'Confirmed';
                $scope.bookings.$save(booking);
            });
        };
    }])
    .controller('UserCtrl', ['$scope', 'transactions', 'auth', function ($scope, transactions, auth) {
        $scope.auth = auth;
        auth.$getCurrentUser().then(function (user) {
            $scope.user = user;
        });

        $scope.$on('$firebaseSimpleLogin:login', function () {
            $scope.user = auth.user;
        });

        $scope.$on('$firebaseSimpleLogin:logout', function () {
            $scope.user = auth.user;
        });

        $scope.balance = 0;
        transactions.$loaded().then(function (transactions) {
            if (transactions) {
                $scope.balance = balance(transactions.$sync);

                transactions.$sync.$watch(function () {
                    console.log('watch', transactions.$sync);
                    $scope.balance = balance(transactions.$sync);
                });
            }
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

        $scope.deposit = function () {
            transactions.$sync.$add({
                type:'debit',
                value: Number($scope.depositAmount),
                timestamp: new Date().getTime()
            });

            $scope.depositAmount = null;
            $scope.showDeposit = false;
        };
    }]);
