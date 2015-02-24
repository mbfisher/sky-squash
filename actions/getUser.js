'use strict';

var debug = require('debug')('App:Action:getUser');
var Firebase = require('firebase');

module.exports = function getUser (context, payload, done) {
    var ref = new Firebase(FIREBASE);
    var reload;

    function login() {
        if (sessionStorage.redirect) {
            debug('sessionStore.redirect found, waiting for onAuth to be called again');

            reload = setTimeout(function () {
                console.warn('OAuth timeout triggered!');

                debug('Clearing sessionStorage.redirect');
                delete sessionStorage.redirect;

                debug('Reloading');
                location.reload();
            }, 5000);

            return;
        }

        debug('Setting sessionStorage.redirect');
        sessionStorage.redirect = true;

        debug('Logging in...');
        ref.authWithOAuthRedirect('google', function (err) {
            if (err) {
                throw err;
            }
        });
    }
    
    function handleAuthData(authData) {
        debug('Handling auth data', authData);

        if (reload) {
            debug('Clearing reload timeout');
            clearTimeout(reload);
        }

        ref.child('users').child(authData.uid).once('value', function (snapshot) {
            var user = snapshot.val();

            if (user === null) {
                user = {
                    uid: authData.uid,
                    provider: authData.provider,
                    displayName: authData.google.displayName,
                    balance: 0,
                    deposits: []
                };
                ref.child('users').child(authData.uid).set(user);
            }

            context.dispatch('RECEIVE_USER', user);
            done();
        });
    }

    ref.onAuth(function (authData) {
        console.log('onAuth', authData); 

        if (authData === null) {
            login();
        } else {
            handleAuthData(authData);
        }
    });
};
