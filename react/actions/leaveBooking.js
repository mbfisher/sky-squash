'use strict';

var UserStore = require('../stores/UserStore');

module.exports = function (context, payload, done) {
    var booking = payload.booking;
    var user = context.getStore(UserStore).getUser();

    booking.removePlayer(user);

    context.dispatch('UPDATE_BOOKING', booking);
    done();
};
