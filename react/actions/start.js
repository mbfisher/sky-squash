'use strict';

var getUser = require('./getUser');

module.exports = function startAction (context, payload, done) {
    context.executeAction(getUser, {}, function (err) {
        done();
    });
};
