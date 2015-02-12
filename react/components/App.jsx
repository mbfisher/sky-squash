'use strict';

var React = require('react');

var Account = require('./Account');
var NewBooking = require('./NewBooking');
var Bookings = require('./Bookings');

var App = React.createClass({
    render: function () {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-10"><h1>Squash</h1></div>
                    <div className="col-xs-2">
                        <Account context={this.props.context} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <NewBooking context={this.props.context} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Bookings context={this.props.context} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = App;
