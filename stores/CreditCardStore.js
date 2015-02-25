'use strict';

var createStore = require('fluxible/utils/createStore');
var Firebase = require('firebase');

module.exports = createStore({
    storeName: 'CreditCardStore',

    initialize: function () {
        this._balance = null;

        this._ref = new Firebase(FIREBASE).child('card');
        this._ref.on('value', this.receiveData.bind(this));
    },

    receiveData: function (snapshot) {
        var data = snapshot.val();
        this._balance = data.balance;

        this.emitChange();
    },

    getBalance: function () {
        return this._balance;
    }
});
