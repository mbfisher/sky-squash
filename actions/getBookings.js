'use strict';

var Firebase = require('firebase');

module.exports = function getBookings (context, payload, done) {
    var ref = new Firebase(FIREBASE+'/bookings');

    ref.once('value', function (snapshot) {
        context.dispatch('RECEIVE_BOOKINGS', snapshot.val());

        done();
    });
};
