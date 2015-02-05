'use strict';

var debug = require('debug')('App:Store:UserStore');
var createStore = require('fluxible/utils/createStore');

var Firebase = require('firebase');

module.exports = createStore({
    storeName: 'UserStore',
    handlers: {
        RECEIVE_USER: 'receiveUser',
        RECEIVE_BALANCE: 'receiveBalance'
    },

    initialize: function () {
        this.user = null;
        this.transactions = {
            credit: [],
            debit: []
        };
    },

    receiveUser: function (user) {
        debug('Receiving user', user);

        this.user = user;

        this.ref = new Firebase(FIREBASE+'/users').child(user.uid);

        this.emitChange();
    },

    receiveBalance: function (payload) {
        debug('Receiving balance', payload);

        this.user.balance = payload.balance;

        debug('Updating user balance');
        this.ref.set(this.user);
        this.emitChange();
    },

    getUser: function () {
        return this.user;
    },

    isLoggedIn: function () {
        return !!this.user;
    },

    getTransactions: function () {
        return this.transactions;
    }
});
