'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible').Mixin;
var UserStore = require('../stores/UserStore');

var Account = React.createClass({
    mixins: [FluxibleMixin],

    statics: {
        storeListeners: [UserStore]
    },

    getInitialState: function () {
        return this.getStateFromStores();
    },

    getStateFromStores: function () {
        return {
            user: this.getStore(UserStore).getUser()
        };
    },

    onChange: function () {
        this.setState(this.getStateFromStores());
    },

    render: function () {
        if (!this.state.user) {
            return <h2>Loading</h2>;
        }

        var displayName = this.state.user.displayName;

        return <p>{displayName}</p>;
    }
});

module.exports = Account;
