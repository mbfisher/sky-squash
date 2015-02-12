'use strict';

var moment = require('moment');
var Player = require('./Player');
var _ = require('lodash');

function Booking(
    moment,
    location,
    status,
    players,
    cost,
    courts,
    id
) {
    this._moment = moment;
    this._location = location;
    this._status = status || Booking.STATUS_OPEN;
    this._players = players || {};
    this._cost = cost || 0;
    this._courts = courts || 0;

    this._id = id || null;
}

Booking.STATUS_OPEN = 'Open';
Booking.STATUS_CLOSED = 'Closed';
Booking.STATUS_COMPLETE = 'Complete';

Booking.create = function (data, id) {
    return new Booking(
        data.moment || (data.timestamp ? moment.unix(data.timestamp) : null),
        data.location,
        data.status,
        data.players ? _.indexBy(_.map(data.players, Player.create), function (player) {
            return player.getUid();
        }) : {},
        data.cost,
        data.courts,
        id || data.id
    );
};

Booking.prototype.getMoment = function () {
    return this._moment;
};

Booking.prototype.getLocation = function () {
    return this._location;
};

Booking.prototype.getStatus = function () {
    return this._status;
};

Booking.prototype.getPlayers = function () {
    return this._players;
};

Booking.prototype.getCost = function () {
    return this._cost;
};

Booking.prototype.getCourts = function () {
    return this._courts;
};

Booking.prototype.getId = function () {
    return this._id;
};

Booking.prototype.isOpen = function () {
    return this._status === Booking.STATUS_OPEN;
};

Booking.prototype.isComplete = function () {
    return this._status === Booking.STATUS_COMPLETE;
};

Booking.prototype.getPlayer = function (uid) {
    return this._players[uid];
};

Booking.prototype.addPlayer = function (user, player) {
    player = player || Player.createFromUser(user);
    this._players[user.uid] = player;
};

Booking.prototype.removePlayer = function (user) {
    delete this._players[user.uid];
};

module.exports = Booking;
