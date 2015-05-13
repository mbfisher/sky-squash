'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var BookingStore = require('../stores/BookingStore');
var UserStore = require('../stores/UserStore');

var _ = require('lodash');

var Booking = require('./Booking');

var Bookings = React.createClass({
    mixins: [FluxibleMixin],

    statics: {
        storeListeners: [BookingStore, UserStore]
    },

    getInitialState: function () {
        return this.getStateFromStores();
    },

    getStateFromStores: function () {
        return {
            bookings: this.props.context.getStore(BookingStore).getBookings(),
            user: this.props.context.getStore(UserStore).getUser()
        };
    },

    onChange: function () {
        this.setState(this.getStateFromStores());
    },

    render: function () {
        var bookings = _.map(this.state.bookings, function (booking, i) {
            if (booking.isOpen()) {
                return <Booking context={this.props.context} booking={booking} user={this.state.user} key={i} />;
            }
        }, this);

        return <div>{bookings}</div>;
    }
});

module.exports = Bookings;
