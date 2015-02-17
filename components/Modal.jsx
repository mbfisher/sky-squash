'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible').Mixin;
var ModalStore = require('../stores/ModalStore');

var closeModal = require('../actions/closeModal');

var Modal = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [ModalStore]
    },

    getInitialState: function () {
        return {
            modal: null
        };
    },

    onChange: function () {
        this.setState({
            modal: this.getStore(ModalStore).getModal()
        });
    },

    close: function () {
        this.props.context.executeAction(closeModal);
    },

    render: function () {
        if (!this.state.modal) {
            return false;
        }

        var modal = this.state.modal;

        return (
            <div className="modal-container">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {modal.title}
                            <button type="button" className="close" onClick={this.close}><span>&times;</span></button>
                        </div>
                        <div className="modal-body">
                            {modal.body}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Modal;
