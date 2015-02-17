'use strict';

var debug = require('debug')('App:Action:getBalance');

var _ = require('lodash');
var BookingStore = require('../stores/BookingStore');
var UserStore = require('../stores/UserStore');
var userBalance = require('../utils/userBalance');

module.exports = function getBalance (context, payload, done) {
    var user = context.getStore(UserStore).getUser();

    var bookings = _.filter(context.getStore(BookingStore).getBookings(), function(booking) {
        return booking.isComplete();
    });

    var balance = userBalance(user, bookings);
    if (isNaN(balance)) {
        console.error('Bad balance', balance);
        return;
    }

    debug('Calculated balance as '+balance);
    context.dispatch('RECEIVE_BALANCE', {
        balance: balance
    });

    if (payload.notify) {
        alert('Balance updated');
    }

    done();
};

