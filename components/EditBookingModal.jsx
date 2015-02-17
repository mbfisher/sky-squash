'use strict';

var React = require('react');

var moment = require('moment');
var updateBooking = require('../actions/updateBooking');
var closeModal = require('../actions/closeModal');
var UsersStore = require('../stores/UsersStore');
var FluxibleMixin = require('fluxible').Mixin;
var _ = require('lodash');

var EditBookingModal = React.createClass({
    mixins: [FluxibleMixin, React.addons.LinkedStateMixin],
    statics: {
        storeListeners: [UsersStore]
    },

    getInitialState: function () {
        var booking = this.props.booking;

        return {
            time: booking.getMoment().format('HH:mm'),
            date: booking.getMoment().format('YYYY-MM-DD'),
            location: booking.getLocation(),
            courts: booking.getCourts(),
            cost: booking.getCost(),

            users: [],
            playerSearch: '',
            searchResults: []
        };
    },

    onChange: function () {
        this.setState({
            users: this.getStore(UsersStore).all()
        });
    },

    update: function (event) {
        event.preventDefault();

        var _moment = moment(this.state.date+' '+this.state.time);
        if (!_moment.isValid()) {
            alert('Invalid date');
        }

        var booking = this.props.booking;
        booking.setMoment(_moment);
        booking.setLocation(this.state.location);
        booking.setCourts(parseInt(this.state.courts));
        booking.setCost(parseFloat(this.state.cost));

        this.props.context.executeAction(updateBooking, {booking: booking});
        this.props.context.executeAction(closeModal);
    },

    addPlayer: function (event) {
        event.preventDefault();

        var uid = this.refs.addPlayer.getDOMNode().value;
        var user = this.state.users[uid];
        this.props.booking.addPlayer(user);

        this.forceUpdate();
    },

    removePlayer: function (uid) {
        this.props.booking.removePlayer(uid);

        this.forceUpdate();
    },

    render: function () {
        var booking = this.props.booking;

        var players = _.map(booking.getPlayers(), function (player, i) {
            return <li key={i} className="list-group-item">{player.getDisplayName()}<a className="pull-right" onClick={this.removePlayer.bind(this, i)}><span className="glyphicon glyphicon-minus-sign text-danger"></span></a></li>;
        }, this);

        var users = _.map(this.state.users, function (user, i) {
            return <option value={i} key={i}>{user.displayName}</option>;
        });

        var searchInputStyle = {
            width: '80%'
        };

        return (
            <div>
                <form className="form" onSubmit={this.update}>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>Date (YYYY-MM-DD)</label>
                                <input className="form-control" valueLink={this.linkState('date')}/>
                            </div>
                            <div className="form-group">
                                <label>Time (hh:mm)</label>
                                <input className="form-control" valueLink={this.linkState('time')}/>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input className="form-control" valueLink={this.linkState('location')}/>
                            </div>
                            <div className="form-group">
                                <label>Courts</label>
                                <input className="form-control" valueLink={this.linkState('courts')}/>
                            </div>
                            <div className="form-group">
                                <label>Cost</label>
                                <input className="form-control" valueLink={this.linkState('cost')}/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>Players</label>
                                <ul className="list-group">{players}</ul>
                            </div>
                            <div className="form-group">
                                <select className="form-control pull-left" ref="addPlayer" style={searchInputStyle}>{users}</select>
                                <button className="btn btn-default pull-right" onClick={this.addPlayer}>Add</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <button type="submit" className="btn btn-default">Update</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = EditBookingModal;
