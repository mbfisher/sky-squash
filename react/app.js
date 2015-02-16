'use strict';

var Fluxible = require('fluxible');
var Firebase = require('firebase');
var App = require('./components/App');

var app = new Fluxible({
    appComponent: App
});

app.registerStore(require('./stores/UserStore'));
app.registerStore(require('./stores/UsersStore'));
app.registerStore(require('./stores/BookingStore'));
app.registerStore(require('./stores/ModalStore'));

module.exports = app;
