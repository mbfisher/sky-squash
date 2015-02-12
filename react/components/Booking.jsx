'use strict';

var React = require('react');
var moment = require('moment');
var _ = require('lodash');

var joinBooking = require('../actions/joinBooking');
var leaveBooking = require('../actions/leaveBooking');
var deleteBooking = require('../actions/deleteBooking');

var Booking = React.createClass({
    handleJoin: function () {
        this.props.context.executeAction(joinBooking, {booking: this.props.booking});
    },
    handleLeave: function () {
        this.props.context.executeAction(leaveBooking, {booking: this.props.booking});
    },
    handleDelete: function () {
        this.props.context.executeAction(deleteBooking, {booking: this.props.booking});
    },

    render: function () {
        var booking = this.props.booking;
        var players = _.map(booking.getPlayers(), function (player) {
            return <li>{player.getDisplayName()}</li>;
        });

        var joinOrLeave;
        if (booking.getPlayers().hasOwnProperty(this.props.user.uid)) {
            joinOrLeave = <button className="btn btn-default" onClick={this.handleLeave}>Leave</button>;
        } else {
            joinOrLeave = <button className="btn btn-default" onClick={this.handleJoin}>Join</button>;
        }

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="row">
                        <div className="col-xs-3">
                            <h4>{booking.getMoment().format('dddd Do MMM YYYY HH:mm')}</h4>
                            <h5>{booking.getLocation()}</h5>
                        </div>
                        <div className="col-xs-1 col-xs-offset-6">{joinOrLeave}</div>
                        <div className="col-xs-2">
                            <div className="dropdown">
                                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                                    Manage <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a onClick={this.handleJoin}>Join</a></li>
                                    <li><a onClick={this.handleDelete}>Delete</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel-body">
                    <ul>
                        {players}
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = Booking;
