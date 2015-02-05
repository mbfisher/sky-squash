'use strict';

var Firebase = require('firebase');
var BookingMapper = require('../mappers/BookingMapper');

module.exports = function deleteBooking (context, payload, done) {
    var ref = new Firebase(FIREBASE+'/bookings');

    BookingMapper.delete(ref, payload, done);
};
