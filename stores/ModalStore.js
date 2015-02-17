'use strict';

var createStore = require('fluxible/utils/createStore');

module.exports = createStore({
    storeName: 'ModalStore',
    handlers: {
        OPEN_MODAL: 'openModal',
        CLOSE_MODAL: 'closeModal'
    },

    initialize: function () {
        this._modal = null;
    },

    openModal: function (modal) {
        this._modal = modal;
        this.emitChange();
    },

    closeModal: function () {
        this._modal = null;
        this.emitChange();
    },

    getModal: function () {
        return this._modal;
    }
});
