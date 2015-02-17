'use strict';

module.exports = function (context, payload, done) {
    context.dispatch('OPEN_MODAL', payload);
    done();
};
