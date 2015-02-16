'use strict';

var React = require('react/addons');

var createBooking = require('../actions/createBooking');

var moment = require('moment');
var Booking = require('../models/Booking');

var NewBooking = React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    getInitialState: function () {
        return {
            location: null,
            time: null
        };
    },

    handleSubmit: function (event) {
        event.preventDefault();

        var _moment = moment(this.state.date+' '+this.state.time);
        if (!_moment.isValid()) {
            alert('Invalid date');
        }

        this.props.context.executeAction(createBooking, {
            booking: new Booking(_moment, this.state.location)
        });
    },

    handleDate: function (timestamp) {
        this.setState({
            time: timestamp
        });
    },
    
    render: function () {
        return (
            <div>
                <form onSubmit={this.handleSubmit} className="form form-inline">
                    <div className="form-group">
                        <input ref="date" placeholder="Date (YYYY-MM-DD)" valueLink={this.linkState('date')} className="form-control"/>
                    </div>
                    <div className="form-group">
                        <input ref="time" placeholder="Time (hh:mm)" valueLink={this.linkState('time')} className="form-control"/>
                    </div>
                    <div className="form-group">
                        <input ref="location" placeholder="Location" valueLink={this.linkState('location')} className="form-control"/>
                    </div>
                    <button type="submit" className="btn btn-default">Create</button>
                </form>
            </div>
        );
    }
});

module.exports = NewBooking;
