'use strict';

var debug = require('debug')('App:Action:getBalance');
var debugTimer = require('debug')('Timer:getBalance');
var Booking = require('../models/Booking');
var _ = require('lodash');
var async = require('async');
var moment = require('moment');

var bookingCost = require('../utils/bookingCost');

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
                balance -= bookingCost(booking, uid);
            }
        });

        debug('Calculated balance as '+balance);
        context.dispatch('RECEIVE_BALANCE', {
            uid: uid,
            balance: balance
        });

        done();
    });

};

