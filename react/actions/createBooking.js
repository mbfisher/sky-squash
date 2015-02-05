'use strict';

var debug = require('debug')('App:Action:createBooking');

var Firebase = require('firebase');
var moment = require('moment');
var Booking = require('../models/Booking');
var BookingMapper = require('../mappers/BookingMapper');

module.exports = function createBooking (context, payload, done) {
    var booking = Booking.create(payload);

    var ref = new Firebase(FIREBASE+'/bookings');
    BookingMapper.create(ref, booking);

    context.dispatch('NEW_BOOKING', booking);

    done();
};
