'use strict';

var React = require('react');
var moment = require('moment');
var _ = require('lodash');

var joinBooking = require('../actions/joinBooking');
var leaveBooking = require('../actions/leaveBooking');
var deleteBooking = require('../actions/deleteBooking');
var completeBooking = require('../actions/completeBooking');
var openModal = require('../actions/openModal');
var EditBookingModal = require('./EditBookingModal');

var Booking = React.createClass({
    handleJoin: function () {
        this.props.context.executeAction(joinBooking, {booking: this.props.booking});
    },
    handleLeave: function () {
        this.props.context.executeAction(leaveBooking, {booking: this.props.booking});
    },
    handleEdit: function () {
        var modalBody = <EditBookingModal context={this.props.context} booking={this.props.booking} />;
        this.props.context.executeAction(openModal, {
            title: 'Edit Booking',
            body: modalBody
        });
    },
    handleComplete: function () {
        if (confirm('Sure?')) {
            this.props.context.executeAction(completeBooking, {booking: this.props.booking});
        }
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

        var style = {
            width: '48%',
            margin: '1%',
            float: 'left'
        };
        return (
            <div className="panel panel-default" style={style}>
                <div className="panel-heading">
                    <div className="row">
                        <div className="col-sm-6">
                            <h4>{booking.getMoment().format('dddd Do MMM YYYY HH:mm')}</h4>
                            <h5>{booking.getLocation()} | Courts: {booking.getCourts()} | Cost: &pound;{booking.getCost().toFixed(2)}</h5>
                        </div>
                        <div className="col-sm-6">
                            <div className="btn-group pull-right">
                                {joinOrLeave}
                                <div className="btn-group">
                                    <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                                        <span className="glyphicon glyphicon-cog"></span> <span className="caret"></span>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><a onClick={this.handleEdit}>Edit</a></li>
                                        <li><a onClick={this.handleComplete}>Complete</a></li>
                                        <li><a onClick={this.handleDelete}>Delete</a></li>
                                    </ul>
                                </div>
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
