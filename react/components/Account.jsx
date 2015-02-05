'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible').Mixin;
var UserStore = require('../stores/UserStore');

var getBalance = require('../actions/getBalance');

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

    refreshBalance: function () {
        this.props.context.executeAction(getBalance, {
            uid: this.state.user.uid
        });
    },

    componentDidMount: function () {
        this.refreshBalance();
    },

    render: function () {
        if (!this.state.user) {
            return <h2>Loading</h2>;
        }

        var user = this.state.user;

        var balance;
        if (user.balance) {
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
