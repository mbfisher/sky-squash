'use strict';

var createStore = require('fluxible/utils/createStore');
var Firebase = require('firebase');

var Booking = require('../models/Booking');
var moment = require('moment');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BookingStore',
    handlers: {
        RECEIVE_BOOKINGS: 'receiveBookings'
    },

    initialize: function () {
        this.bookings = [];

        this.ref = new Firebase(FIREBASE);
        this.ref.child('bookings').on('value', function (snapshot) {
            this.receiveBookings(snapshot.val());
        }.bind(this));
    },

    receiveBookings: function (bookings) {
        this.bookings = _.reduce(bookings, function (result, booking, id) {
            booking.timestamp = booking.timestamp || booking.time;

            booking.moment = moment.unix(parseInt(booking.timestamp));

            if (!booking.moment.isValid()) {
                console.error('Invalid date', booking);
            }

            booking.id = id;
            delete(booking.timestamp);

            result.push(Booking.create(booking));

            return result;
        }, []);

        this.emitChange();
    },

    getBookings: function () {
        return this.bookings;
    }
});
