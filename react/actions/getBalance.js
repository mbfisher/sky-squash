'use strict';

var debug = require('debug')('App:Action:getBalance');

var _ = require('lodash');
var Firebase = require('firebase');
var BookingStore = require('../stores/BookingStore');
var userBalance = require('../utils/userBalance');

module.exports = function getBalance (context, payload, done) {
    var uid = payload.uid;

    var bookings = _.filter(context.getStore(BookingStore).getBookings(), function(booking) {
        return booking.isComplete();
    });

    var ref = new Firebase(FIREBASE);
    userBalance(ref, uid, bookings, function (balance) {
        if (isNaN(balance)) {
            console.error('Bad balance', balance);
            return;
        }

        debug('Calculated balance as '+balance);
        context.dispatch('RECEIVE_BALANCE', {
            uid: uid,
            balance: balance
        });

        done();
    });

};

