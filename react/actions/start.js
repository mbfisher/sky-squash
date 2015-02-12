'use strict';

var getUser = require('./getUser');

var BookingStore = require('../stores/BookingStore');
var Booking = require('../models/Booking');
var _ = require('lodash');
var moment = require('moment');

module.exports = function startAction (context, payload, done) {
     context.executeAction(getUser, {}, function (err) {
        if (err) {
            done(err);
            throw err;
        }

        context.getStore(BookingStore).start();
        done();
    });
};
