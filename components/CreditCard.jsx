'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;

var CreditCardStore = require('stores/CreditCardStore');

var CreditCard = React.createClass({
    mixins: [FluxibleMixin],

    statics: {
        storeListeners: [CreditCardStore]
    },

    getInitialState: function () {
        return {
            balance: null
        };
    },

    onChange: function () {
        this.setState({
            balance: this.getStore(CreditCardStore).getBalance()
        });
    },

    render: function () {
        if (!this.state.balance) {
            return false;
        }

        return <p>{this.state.balance}</p>;
    }
});

module.exports = CreditCard;
