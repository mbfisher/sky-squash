'use strict';

module.exports = function deleteBooking (context, payload, done) {
    context.dispatch('DELETE_BOOKING', payload.booking);
    done();
};
