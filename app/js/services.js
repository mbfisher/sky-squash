'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('skySquash.services', [])
    .factory('auth', ['$firebaseSimpleLogin', function ($firebaseSimpleLogin) {
        var ref = new Firebase('https://sky-squash.firebaseio.com');
        var authClient = $firebaseSimpleLogin(ref);

        authClient.$getCurrentUser().then(function (user) {
            console.log('Current user', user);
            if (user) {
                ref.child('users').child(user.uid).set({
                    displayName: user.displayName,
                    provider: user.provider,
                    provider_id: user.id
                });
            } else {
                // Logged out
            }
        });

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

        auth.$getCurrentUser().then(function () {
            var ref = new Firebase('https://sky-squash.firebaseio.com/users').child(auth.user.uid);
            user.$sync = $firebase(ref).$asObject();

            user.$sync.$loaded().then(function () {
                df.resolve(user);
            });
        });

        return user;
    }])
    .factory('transactions', ['$firebase', 'auth', '$q', function ($firebase, auth, $q) {
        var df = $q.defer();
        var transactions = {
            $sync: null,
            $loaded: function () {
                return df.promise;
            }
        };

        auth.$getCurrentUser().then(function () {
            var ref = new Firebase('https://sky-squash.firebaseio.com/transactions').child(auth.user.uid);
            transactions.$sync = $firebase(ref).$asArray();

            transactions.$sync.$loaded().then(function () {
                df.resolve(transactions);
            });
        });

        return transactions;
    }]);
