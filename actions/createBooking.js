'use strict';

var debug = require('debug')('App:Action:createBooking');

var Booking = require('../models/Booking');

module.exports = function createBooking (context, payload, done) {
    var booking = payload.booking;

    debug('Creating bookings', booking.getMoment().format(), booking.getLocation());
    context.dispatch('CREATE_BOOKING', payload.booking);

    done();
};
