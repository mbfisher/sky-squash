'use strict';

var Firebase = require('firebase');
var _ = require('lodash');
var Booking = require('../models/Booking');
var userBalance = require('../utils/userBalance');

var ref = new Firebase('http://sky-squash.firebaseio.com');

ref.child('bookings').once('value', function (snapshot) {
    var bookings = _.map(snapshot.val(), Booking.create).filter(function (booking) {
        return booking.isComplete();
    });

    var total = 0;
    ref.child('users').once('value', function (snapshot) {
        var balance;
        _.each(snapshot.val(), function (user) {
            balance = userBalance(user, bookings);
            total += balance;
            console.log(user.displayName, balance.toFixed(2));
        });

        console.log('TOTAL', total.toFixed(2));
        process.exit(0);
    });
});
