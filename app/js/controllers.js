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
            var when = $scope.new.when.date;
            var time = $scope.new.when.time || new Date();

            when.setHours(time.getHours());
            when.setMinutes(time.getMinutes());
            when.setSeconds(0);

            var booking = {
                status: 'Open',
                time: Math.floor(when.getTime() / 1000),
                location:  $scope.new.location
            };

            $scope.bookings.$add(booking);
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
            var user = users.$getRecord(id);
            if (user) {
                return user.displayName;
            } else {
                console.error('No user found for id', id);
                return '???';
            }
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

                    var dt = new Date(booking.time * 1000);
                    $scope.when = {
                        date: dt,
                        time: dt
                    };

                    $scope.ok = function () {
                        var time = new Date($scope.when.date);
                        time.setHours($scope.when.time.getHours());
                        time.setMinutes($scope.when.time.getMinutes());
                        time.setSeconds(0);
                        booking.time = Math.floor(time.getTime() / 1000);

                        $instance.close($scope.booking);
                    };

                    $scope.cancel = function () {
                        $instance.dismiss('cancel');
                    };
                }]
            });
            
            modal.result.then(function(booking) {
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
    .controller('UserCtrl', ['$scope', 'db', 'transactions', 'auth', '$firebase', function ($scope, db, transactions, auth, $firebase) {
        $scope.auth = auth;
        $scope.transactions = [];
        $scope.balance = 0;

        $scope.$on('$firebaseSimpleLogin:login', function () {
            $scope.user = auth.user;

            auth.$getCurrentUser().then(function (user) {
                console.log('Current user', user);
                db.child('users').child(user.uid).set(user);
            });

            var ref = new Firebase('https://sky-squash.firebaseio.com/bookings');
            var bookings = $firebase(ref).$asArray();
            bookings.$loaded().then(function () {
                var balance = 0;
                bookings.forEach(function (booking) {
                    if (!booking.cost) {
                        return;
                    }

                    if (!booking.players || !booking.players[$scope.user.uid]) {
                        return;
                    }

                    var totalPlayers = 0;

                    Object.keys(booking.players).forEach(function (uid) {
                        totalPlayers += 1 + booking.players[uid].guests;
                    });

                    var costPerPlayer = booking.cost / totalPlayers;

                    var options = booking.players[$scope.user.uid];
                    balance -= costPerPlayer * (options.guests + 1);
                });

                transactions($scope.user.uid).$loaded().then(function (transactions) {
                    if (transactions) {
                        $scope.transactions = transactions.$sync;
                        $scope.balance = balance + getBalance(transactions.$sync);

                        transactions.$sync.$watch(function () {
                            $scope.balance = balance + getBalance(transactions.$sync);
                        });
                    } else {
                        $scope.balance = balance;
                    }
                });
            });

            function getBalance(transactions) {
                return transactions.reduce(function (carry, item) {
                    if (item.type === 'debit') {
                        carry += item.value;
                    }

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
    }])
    .controller('DatepickerCtrl', ['$scope', function ($scope) {
        $scope.isOpen = false;

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.isOpen = true;
        };
    }]);
