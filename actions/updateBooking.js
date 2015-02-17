'use strict';

var UserStore = require('../stores/UserStore');

module.exports = function joinBooking (context, payload, done) {
    context.dispatch('UPDATE_BOOKING', payload.booking);
    done();
};
