'use strict';

var debug = require('debug')('App:Mapper:Booking');

module.exports = {
    initialize: function (firebase) {
        this.ref = firebase.child('bookings');
    },

    create: function (ref, booking) {
        debug('Creating booking', booking);
        ref.push(this.format(booking));
    },

    delete: function (ref, booking, done) {
        ref.child(booking.getId()).remove(done);
    },

    format: function (booking) {
        return {
            timestamp: parseInt(booking.getMoment().format('X')),
            location: booking.getLocation(),
            status: booking.getStatus()
        };
    }
};
