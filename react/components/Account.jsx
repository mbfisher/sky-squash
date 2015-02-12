'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible').Mixin;
var UserStore = require('../stores/UserStore');
var BookingStore = require('../stores/BookingStore');

var getBalance = require('../actions/getBalance');

var Account = React.createClass({
    mixins: [FluxibleMixin],

    statics: {
        storeListeners: {
            onUserChange: UserStore,
            onBookingsChange: BookingStore
        }
    },

    getInitialState: function () {
        return this.getStateFromStores();
    },

    getStateFromStores: function () {
        return {
            user: this.getStore(UserStore).getUser()
        };
    },

    onUserChange: function () {
        this.setState(this.getStateFromStores());
    },

    onBookingsChange: function () {
        this.refreshBalance();
    },

    refreshBalance: function () {
        this.props.context.executeAction(getBalance, {
            uid: this.state.user.uid
        });
    },

    render: function () {
        if (!this.state.user) {
            return <h2>Loading</h2>;
        }

        var user = this.state.user;

        var balance;
        if (user.balance !== undefined) {
            balance = <span><a onClick={this.refreshBalance}>&pound;{user.balance.toFixed(2)}</a></span>;
        } else {
            balance = <span>?</span>;
        }

        return (
            <div>
                <p>{user.displayName} ({balance})</p>
            </div>
        );
    }
});

module.exports = Account;
