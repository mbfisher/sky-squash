'use strict';

var debug = require('debug')('App:Action:getBalance');
var debugTimer = require('debug')('Timer:getBalance');
var Booking = require('../models/Booking');
var _ = require('lodash');
var async = require('async');
var moment = require('moment');

module.exports = function getBalance (context, payload, done) {
    var uid = payload.uid;

    var ref = new Firebase(FIREBASE);

    debugTimer('start');

    async.parallel([
        function (cb) {
            ref.child('bookings').once('value', function (snapshot) {
                cb(null, snapshot.val());
            });
        },
        function (cb) {
            ref.child('transactions').child(uid).once('value', function (snapshot) {
                cb(null, snapshot.val());
            });
        },
    ], function (err, results) {
        var bookings = _.map(results[0], Booking.create).filter(function(booking) {
            return booking.isComplete();
        });
        var transactions = results[1];
        var debitTransactions = _.filter(transactions, function (transaction) {
            return transaction.type === 'debit';
        });

        // Sum debit transactions (deposits)
        var balance = _.reduce(debitTransactions, function (result, transaction) {
            result += transaction.value;
            return result;
        }, 0);

        _.each(bookings, function (booking) {
            var played = booking.getPlayers().hasOwnProperty(uid);

            if (played) {
                var bookingCost = getBookingCost(booking, uid);
                balance -= bookingCost;
            }
        });

        debugTimer('end');
        debug('Calculated balance as '+balance);
        context.dispatch('RECEIVE_BALANCE', {
            uid: uid,
            balance: balance
        });

        done();
    });

    function getBookingCost(booking, uid) {
        var cost = booking.getCost();
        var playInfo = booking.getPlayer(uid);

        // Joined players
        var players = Object.keys(booking.getPlayers()).length;
        // Sum of join players' guests
        var guests = _.reduce(booking.getPlayers(), function (result, player) {
            result += (player.guests || 0);
            return result;
        }, 0);

        var costPerPlayer = cost / (players + guests);
        
        var playerGuests = playInfo.guests || 0;

        var playerCost = costPerPlayer * (1 + playerGuests);

        return playerCost;
    }
};

