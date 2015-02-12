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

    refreshBalance: function (event) {
        this.props.context.executeAction(getBalance, {
            uid: this.state.user.uid,
            notify: !!event
        });
    },

    render: function () {
        if (!this.state.user) {
            return <h2>Loading</h2>;
        }

        var user = this.state.user;

        var balance;
        if (user.balance !== undefined) {
            balance = <span>&pound;{user.balance.toFixed(2)}</span>;
        } else {
            balance = <span>?</span>;
        }

        var style = {
            padding: '12px'
        };
        return (
            <div style={style}>
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                        {user.displayName} ({balance}) <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        <li><a onClick={this.refreshBalance}>Refresh balance</a></li>
                        <li><a onClick={this.handleDeposit}>Deposit</a></li>
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = Account;
