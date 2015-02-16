'use strict';

var Booking = require('../models/Booking');
var getBalance = require('./getBalance');

module.exports = function (context, payload, done) {
    var booking = payload.booking;

    booking.setStatus(Booking.STATUS_COMPLETE);
    context.dispatch('UPDATE_BOOKING', booking);

    context.executeAction(getBalance, {}, done);
};
