'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible').Mixin;
var BookingStore = require('../stores/BookingStore');

var _ = require('lodash');

var Booking = require('./Booking');

var Bookings = React.createClass({
    mixins: [FluxibleMixin],

    statics: {
        storeListeners: [BookingStore]
    },

    getInitialState: function () {
        return this.getStateFromStores();
    },

    getStateFromStores: function () {
        return {
            bookings: this.getStore(BookingStore).getBookings()
        };
    },

    onChange: function () {
        this.setState(this.getStateFromStores());
    },

    render: function () {
        var bookings = _.map(this.state.bookings, function (booking, i) {
            if (booking.isOpen()) {
                return <Booking context={this.props.context} booking={booking} key={i} />;
            }
        }, this);

        return <div>{bookings}</div>;
    }
});

module.exports = Bookings;
