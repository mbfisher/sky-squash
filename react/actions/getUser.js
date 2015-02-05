'use strict';

var debug = require('debug')('App:Action:getUser');
var Firebase = require('firebase');
var cookie = require('cookie');

module.exports = function getUser (context, payload, done) {
    var cookies = cookie.parse(document.cookie);
    var authCookie = cookies.auth;

    if (authCookie) {
        authCookie = JSON.parse(authCookie);
    } else {
        debug('Creating auth cookie');
        authCookie = {
            attempts: 0
        }
        document.cookie = cookie.serialize('auth', JSON.stringify(authCookie));
    }
    
    debug('authCookie', authCookie);

    var ref = new Firebase(FIREBASE);

    ref.onAuth(function (authData) {
        if (authData === null) {
            if (authCookie.attempts >= 3) {
                alert('Exceeded auth attempts!');
                return;
            }

            authCookie.attempts++;
            document.cookie = cookie.serialize('auth', JSON.stringify(authCookie));

            debug('Logging in...');
            ref.authWithOAuthPopup('google', function (err, authData) {
                if (err) {
                    throw err;
                }

                debug('Logged in', authData);
                authCookie.attempts = 0;

                var user = {
                    uid: authData.uid,
                    provider: authData.provider,
                    displayName: authData.google.displayName
                };

                ref.child('users').child(authData.uid).set(user);
                context.dispatch('RECEIVE_USER', user);

                done();
            });
        } else {
            debug('Found auth');

            ref.child('users').child(authData.uid).once('value', function (snapshot) {
                context.dispatch('RECEIVE_USER', snapshot.val());

                done();
            });
        }
    });

    /*var ref = new Firebase(FIREBASE+'/users');
    ref.once('value', function (snapshot) {
        console.log(snapshot.val());

        done();
    });*/
};
