'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('skySquash.services', [])
    .value('version', '0.1.0')
    .factory('db', function () {
        var ref = new Firebase('https://sky-squash.firebaseio.com');
        return ref;
    })
    .factory('auth', ['db', '$firebaseSimpleLogin', function (ref, $firebaseSimpleLogin) {
        var authClient = $firebaseSimpleLogin(ref);
        return authClient;
    }])
    .factory('user', ['$firebase', 'auth', '$q', function ($firebase, auth, $q) {
        var df = $q.defer();
        var user = {
            $sync: null,
            $loaded: function () {
                return df.promise;
            }
        };

        auth.$getCurrentUser().then(function (u) {
            if (!u) {
                return df.resolve();
            }

            var ref = new Firebase('https://sky-squash.firebaseio.com/users').child(auth.user.uid);
            user.$sync = $firebase(ref).$asObject();

            user.$sync.$loaded().then(function () {
                df.resolve(user);
            });
        });

        return user;
    }])
    .factory('transactions', ['$firebase', 'auth', '$q', function ($firebase, auth, $q) {
        var cache = {};

        return function (uid) {
            if (cache[uid]) {
                return cache[uid];
            }

            var df = $q.defer();
            var transactions = {
                $sync: null,
                $loaded: function () {
                    return df.promise;
                }
            };

            var ref = new Firebase('https://sky-squash.firebaseio.com/transactions').child(uid);
            transactions.$sync = $firebase(ref).$asArray();

            transactions.$sync.$loaded().then(function () {
                df.resolve(transactions);
            });

            cache[uid] = transactions;
            return transactions;
        };
    }])
    .factory('users', ['$firebase', function ($firebase) {
        var ref = new Firebase('https://sky-squash.firebaseio.com/users');
        return $firebase(ref).$asArray();
    }]);
