'use strict';

var React = require('react');

var Account = require('./Account');

var App = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Squash</h1>
                <Account context={this.props.context} />
            </div>
        );
    }
});

module.exports = App;
