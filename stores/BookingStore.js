'use strict';

var debug = require('debug')('App:Store:BookingStore');

var createStore = require('fluxible/addons/createStore');

var Firebase = require('firebase');
var Booking = require('../models/Booking');
var _ = require('lodash');
var formatBooking = require('../utils/formatBooking');

module.exports = createStore({
    storeName: 'BookingStore',
    handlers: {
        CREATE_BOOKING: 'createBooking',
        DELETE_BOOKING: 'deleteBooking',
        UPDATE_BOOKING: 'updateBooking'
    },

    initialize: function () {
        this.bookings = [];
    },

    start: function () {
        debug('Starting...');

        this._ref = new Firebase(FIREBASE).child('bookings');
        this._ref.on('value', this.receiveBookings.bind(this), Function.prototype.bind.call(console.error, console));
    },

    receiveBookings: function (snapshot) {
        debug('Bookings updated', snapshot.val());
        this._bookings = _.map(snapshot.val(), Booking.create);

        this.emitChange();
    },

    createBooking: function (booking) {
        this._ref.push(formatBooking(booking));
    },

    deleteBooking: function (booking) {
        this._ref.child(booking.getId()).remove();
    },

    updateBooking: function (booking) {
        this._ref.child(booking.getId()).set(formatBooking(booking));
    },

    getBookings: function () {
        return this._bookings;
    },

    getFirebase: function () {
        return this._ref;
    }
});
