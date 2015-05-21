'use strict';

var Firebase = require('firebase');
var _ = require('lodash');
var async = require('async');
var Booking = require('../models/Booking');
var formatBooking = require('../utils/formatBooking');

var currentId = process.argv[2];
var newId = process.argv[3];

var ref = new Firebase('http://sky-squash.firebaseio.com');

ref.child('users').child(newId).once('value', function (snapshot) {
    var newUser = snapshot.val();

    ref.child('bookings').once('value', function (snapshot) {
        var bookings = _.map(snapshot.val(), Booking.create);

        var num = 0;
        async.each(bookings, function (booking, done) {
            var player = booking.getPlayer(currentId);

            if (!player) {
                return done();
            }

            num++;
            console.log(booking.getPlayers());
            process.stdout.write("\n\n");

            booking.removePlayer(currentId);
            booking.addPlayer(newUser);

            console.log(booking.getPlayers());
            process.stdout.write("\n\n-----------\n\n");

            ref.child('bookings').child(booking.getId()).set(formatBooking(booking), done);
        }, function (err) {
            console.log('Updated', num);
            process.exit(0);
        });
    });
});
