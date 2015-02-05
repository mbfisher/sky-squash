'use strict';

var debug = require('debug')('App:Store:UserStore');
var createStore = require('fluxible/utils/createStore');

module.exports = createStore({
    storeName: 'UserStore',
    handlers: {
        RECEIVE_USER: 'receiveUser'
    },

    initialize: function () {
        this.user = null;
    },

    receiveUser: function (user) {
        debug('Receiving user', user);

        this.user = user;

        this.emitChange();
    },

    getUser: function () {
        return this.user;
    },

    isLoggedIn: function () {
        return !!this.user;
    }
});
