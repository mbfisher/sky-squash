'use strict';

var UserStore = require('../stores/UserStore');
var moment = require('moment');
var getBalance = require('./getBalance');

module.exports = function makeDeposit (context, payload, done) {
    var user = context.getStore(UserStore).getUser();

    user.deposits = user.deposits || [];
    user.deposits.push({
        timestamp: moment().format('X'),
        amount: payload.amount
    });

    context.dispatch('UPDATE_USER', user);
    context.executeAction(getBalance, {}, function () {
        if (payload.notify) {
            alert('Deposit accepted');
        }
        done();
    });
};
