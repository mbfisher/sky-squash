'use strict';

var Fluxible = require('fluxible');
var App = require('./components/App');

var app = new Fluxible({
    appComponent: App
});

app.registerStore(require('./stores/UserStore'));

module.exports = app;
