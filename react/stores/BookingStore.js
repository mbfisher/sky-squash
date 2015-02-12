'use strict';

var debug = require('debug')('App:Store:BookingStore');

var createStore = require('fluxible/utils/createStore');

var Firebase = require('firebase');
var Booking = require('../models/Booking');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BookingStore',
    handlers: {
        CREATE_BOOKING: 'createBooking',
        DELETE_BOOKING: 'deleteBooking'
    },

    initialize: function () {
        this.bookings = [];
    },

    start: function () {
        debug('Starting...');

        this._ref = new Firebase(FIREBASE).child('bookings');
        this._ref.on('value', this.receiveBookings.bind(this));
    },

    receiveBookings: function (snapshot) {
        debug('Bookings updated');
        this._bookings = _.map(snapshot.val(), Booking.create);

        this.emitChange();
    },

    createBooking: function (booking) {
        this._ref.push(this._formatModel(booking));
    },

    deleteBooking: function (booking) {
        this._ref.child(booking.getId()).remove();
    },

    getBookings: function () {
        return this._bookings;
    },

    getFirebase: function () {
        return this._ref;
    },

    _formatModel: function (booking) {
        return {
            time: parseInt(booking.getMoment().format('x')),
            location: booking.getLocation(),
            status: booking.getStatus()
        };
    }
});
