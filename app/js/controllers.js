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

        $scope.bookingFilters = {
            Incomplete: {status: '!Completed'},
            Open: {status: 'Open'},
            All: null
        };
        $scope.displayBooking = $scope.bookingFilters.Incomplete;

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
            if (booking.players && user.uid in booking.players) {
                return;
            }

            booking.players = booking.players || {};
            booking.players[user.uid] = {
                guests: 0
            };
            $scope.bookings.$save(booking);
        };

        $scope.leave = function (booking) {
            if (!(booking.players && user.uid in booking.players)) {
                return;
            }

            delete booking.players[user.uid];
            $scope.bookings.$save(booking);
        }

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

        $scope.close = function (booking) {
            booking.status = 'Closed';
            $scope.bookings.$save(booking);
        };

        $scope.edit = function (booking) {
            var modal = $modal.open({
                templateUrl: 'editBooking.html',
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
                $scope.bookings.$save(booking);
            });
        };

        $scope.complete = function (booking) {
            if (!confirm('Sure?')) {
                return;
            }

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
                        booking: booking.$id
                        //timestamp: new Date(booking.time).getTime()
                    });
                });
            });

            booking.status = 'Completed';
            $scope.bookings.$save(booking);
        };
    }])
    .controller('UserCtrl', ['$scope', 'db', 'transactions', 'auth', function ($scope, db, transactions, auth) {
        $scope.auth = auth;
        $scope.transactions = [];
        $scope.balance = 0;

        $scope.$on('$firebaseSimpleLogin:login', function () {
            $scope.user = auth.user;

            auth.$getCurrentUser().then(function (user) {
                console.log('Current user', user);
                db.child('users').child(user.uid).set(user);
            });

            transactions($scope.user.uid).$loaded().then(function (transactions) {
                if (transactions) {
                    $scope.transactions = transactions.$sync;
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
            }
        });

        $scope.$on('$firebaseSimpleLogin:logout', function () {
            $scope.user = auth.user;
        });

        $scope.deposit = function () {
            transactions($scope.user.uid).$loaded().then(function (transactions) {
                transactions.$sync.$add({
                    type:'debit',
                    value: Number($scope.depositAmount),
                    timestamp: new Date().getTime()
                });

                $scope.depositAmount = null;
                $scope.showDeposit = false;
            });
        };
    }]);
