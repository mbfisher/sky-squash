'use strict';

var _ = require('lodash');
var bookingCost = require('./bookingCost');

module.exports = function (user, bookings) {
    var deposits = _.reduce(user.deposits, function (result, deposit) {
        result += deposit.amount;
        return result;
    }, 0);

    var transactions = _.reduce(bookings, function (result, booking) {
        if (booking.getPlayers().hasOwnProperty(user.uid)) {
            result += bookingCost(booking, user.uid);
        }

        return result;
    }, 0);

    return deposits - transactions;
};
