'use strict';

var React = require('react');
var moment = require('moment');

var joinBooking = require('../actions/joinBooking');
var deleteBooking = require('../actions/deleteBooking');

var Booking = React.createClass({
    handleJoin: function () {
        this.props.context.executeAction(joinBooking, this.props.booking);
    },
    handleDelete: function () {
        this.props.context.executeAction(deleteBooking, this.props.booking);
    },

    render: function () {
        var booking = this.props.booking;

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="row">
                        <div className="col-xs-3">
                            <h4>{booking.getMoment().format('dddd Do MMM YYYY HH:mm')}</h4>
                            <h5>{booking.getLocation()}</h5>
                        </div>
                        <div className="col-xs-2 col-xs-offset-7">
                            <div className="dropdown pull-right">
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
                </div>
            </div>
        );
    }
});

module.exports = Booking;
