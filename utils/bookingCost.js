'use strict'

var _ = require('lodash');

module.exports = function bookingCost(booking, uid) {
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
};
