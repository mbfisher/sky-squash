'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible').Mixin;
var UserStore = require('../stores/UserStore');
var BookingStore = require('../stores/BookingStore');

var getBalance = require('../actions/getBalance');
var makeDeposit = require('../actions/makeDeposit');

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
            notify: !!event
        });
    },

    makeDeposit: function (event) {
        event.preventDefault();

        var ref = this.refs.depositAmount.getDOMNode();
        var amount = parseFloat(ref.value);

        if (!isNaN(amount)) {
            this.props.context.executeAction(makeDeposit, {amount: amount, notify: true});
            ref.value = '';
        } else {
            alert('Invalid amount '+amount);
        }
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
                    </ul>
                </div>
                <form className="form form-inline" onSubmit={this.makeDeposit}>
                    <div className="form-group">
                        <input className="form-control" ref="depositAmount" placeholder="Amount" />
                    </div>
                    <button className="btn btn-default">Deposit</button>
                </form>
            </div>
        );
    }
});

module.exports = Account;
