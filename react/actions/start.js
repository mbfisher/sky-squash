'use strict';

var getUser = require('./getUser');
var getBookings = require('./getBookings');

module.exports = function startAction (context, payload, done) {
    context.executeAction(getUser, {}, function (err) {
        if (err) {
            done(err);
            throw err;
        }

        done();
    });
};
