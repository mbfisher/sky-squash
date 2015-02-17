'use strict';

var UserStore = require('../stores/UserStore');

module.exports = function joinBooking (context, payload, done) {
    var booking = payload.booking;
    var user = context.getStore(UserStore).getUser();

    booking.addPlayer(user);

    context.dispatch('UPDATE_BOOKING', booking);
    done();
};
