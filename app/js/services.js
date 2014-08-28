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
                    provuder_id: user.id
                });
            } else {
                // Logged out
            }
        });

        return authClient;
    }])
    .factory('users', ['$firebaseSimpleLogin', '$firebase', function ($firebaseSimpleLogin, $firebase) {
        var ref = new Firebase('https://sky-squash.firebaseio.com/users');
        var sync = $firebase(ref).$asArray();

        var users = {
            $loaded: sync.$loaded,
            all: [],
            get: function (id) {
                return this.all.$getRecord(id);
            }
        };

        sync.$loaded().then(function (data) {
            users.all = data;
        });

        return users;
    }]);
         
