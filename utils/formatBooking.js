'use strict';

var _ = require('lodash');

function formatBooking (booking) {
    return {
        timestamp: parseInt(booking.getMoment().format('X')),
        location: booking.getLocation(),
        status: booking.getStatus(),
        players: formatPlayers(booking.getPlayers()),
        cost: booking.getCost(),
        courts: booking.getCourts()
    };
}

function formatPlayers (players) {
    var result = {};

    _.each(players, function (player) {
        result[player.getUid()] = {
            displayName: player.getDisplayName(),
            guests: player.getGuests()
        };
    });

    return result;
}

module.exports = formatBooking;
