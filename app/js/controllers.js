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
        'transactions',
        '$modal',
        'users',
    function($scope, $firebase, auth, transactions, $modal, users) {
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

            return !(user.uid in booking.players);
        };

        $scope.join = function (booking) {
            if (booking.players && booking.players.indexOf(user.uid) > -1) {
                return;
            }

            booking.players = booking.players || {};
            booking.players[user.uid] = {
                guests: 0
            };
            $scope.bookings.$save(booking);
        };

        $scope.playerName = function (id) {
            return users.$getRecord(id).displayName;
        };

        $scope.info = function (booking) {
            var modal = $modal.open({
                templateUrl: 'editInfo.html',
                resolve: {
                    info: function () {
                        return booking.players[user.uid];
                    }
                },
                controller: ['$scope', '$modalInstance', 'info', function ($scope, $instance, info) {
                    $scope.info = info;

                    $scope.ok = function () {
                        $instance.close();
                    };

                    $scope.cancel = function () {
                        $instance.dismiss('cancel');
                    };
                }]
            });
            
            modal.result.then(function() {
                $scope.bookings.$save(booking);
            });
        };

        $scope.totalPlayers = function (booking) {
            var players = 0;
            angular.forEach(booking.players, function (info, uid) {
                players++;
                players += info.guests;
            });

            return players;
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
                var costPerPlayer = booking.cost / $scope.totalPlayers(booking);

                angular.forEach(booking.players, function (info, uid) {
                    var value = costPerPlayer;
                    if (info.guests) {
                        value += costPerPlayer * info.guests;
                    }

                    transactions(uid).$loaded().then(function (t) {
                        t.$sync.$add({
                            type: 'credit',
                            value: value,
                            booking: booking.$id,
                            timestamp: new Date().getTime()
                        });
                    });
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

            transactions = transactions(user.uid);
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
        });

        $scope.$on('$firebaseSimpleLogin:login', function () {
            $scope.user = auth.user;
        });

        $scope.$on('$firebaseSimpleLogin:logout', function () {
            $scope.user = auth.user;
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
