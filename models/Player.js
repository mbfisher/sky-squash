'use strict';

function Player(uid, displayName, guests) {
    this._uid = uid;
    this._displayName = displayName;
    this._guests = guests || 0;
}

Player.create = function (data, id) {
    return new Player(id, data.displayName, data.guests);
};

Player.createFromUser = function (user) {
    return new Player(user.uid, user.displayName);
};

Player.prototype.getUid = function getUid() {
    return this._uid;
};

Player.prototype.getDisplayName = function getDisplayName() {
    return this._displayName;
};

Player.prototype.getGuests = function getGuests() {
    return this._guests;
};

module.exports = Player;
