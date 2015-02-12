'use strict';

var debug = require('debug')('App:Store:UserStore');
var createStore = require('fluxible/utils/createStore');

var Firebase = require('firebase');

module.exports = createStore({
    storeName: 'UserStore',
    handlers: {
        RECEIVE_USER: 'receiveUser',
        RECEIVE_BALANCE: 'receiveBalance',
        UPDATE_USER: 'updateUser',
    },

    initialize: function () {
        this._ref = new Firebase(FIREBASE).child('users');
        this._user = null;
    },

    receiveUser: function (user) {
        debug('Receiving user', user);

        this._user = user;
        this.emitChange();
    },

    receiveBalance: function (payload) {
        debug('Receiving balance', payload);

        this._user.balance = payload.balance;

        debug('Updating user balance');
        this._ref.child(this._user.uid).set(this._user);
        this.emitChange();
    },

    updateUser: function (user) {
        this._ref.child(user.uid).set(user);
        this._user = user;

        this.emitChange();
    },

    getUser: function () {
        return this._user;
    },

    isLoggedIn: function () {
        return !!this._user;
    },
});
