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

    ref.child('users').once('value', function (snapshot) {
        _.each(snapshot.val(), function (user) {
            userBalance(ref, user.uid, bookings, function (balance) {
                console.log(user.displayName, balance.toFixed(2));
            });
        });
    });
});
