'use strict';

require('./index.html');
require('./styles/index.css');

require('bootstrap/js/dropdown');

require('debug').enable('*');

var React = require('react');
var app = require('./app');
var startAction = require('./actions/start');

var context = app.createContext();

context.executeAction(startAction, {}, function (err) {
    React.render(context.createElement(), document.body);
});
