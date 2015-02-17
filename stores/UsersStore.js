'use strict';

var createStore = require('fluxible/utils/createStore');
var Firebase = require('firebase');

module.exports = createStore({
    storeName: 'UsersStore',

    initialize: function () {
        this._users = {};

        this._ref = new Firebase(FIREBASE).child('users');
        this._ref.on('value', this.receiveUsers.bind(this));
    },

    receiveUsers: function (snapshot) {
        this._users = snapshot.val();
        this.emitChange();
    },

    all: function () {
        return this._users;
    }
});
