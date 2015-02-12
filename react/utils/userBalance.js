'use strict';

var _ = require('lodash');
var bookingCost = require('./bookingCost');

module.exports = function (ref, uid, bookings, done) {
    ref.child('transactions').child(uid).once('value', function (snapshot) {
        var transactions = snapshot.val();

        var debits = _.reduce(transactions, function (result, transaction) {
            if (transaction.type === 'debit') {
                result += transaction.value;
            }

            return result;
        }, 0);

        var credits = _.reduce(bookings, function (result, booking) {
            if (booking.getPlayers().hasOwnProperty(uid)) {
                result += bookingCost(booking, uid);
            }

            return result;
        }, 0);

        done(debits - credits);
    });
};
