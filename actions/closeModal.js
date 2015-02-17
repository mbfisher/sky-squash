'use strict';

module.exports = function closeModal(context, payload, done) {
    context.dispatch('CLOSE_MODAL');
    done();
};
