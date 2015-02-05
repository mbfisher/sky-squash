'use strict';

var Fluxible = require('fluxible');
var Firebase = require('firebase');
var App = require('./components/App');

var app = new Fluxible({
    appComponent: App
});

/*var firebase = new Firebase(FIREBASE);

var mappers = {};
app.registerMapper = function (mapper) {
    var Constructor = function () {
    };
    Constructor.prototype = mapper;
    Constructor.displayName = mapper.mapperName;

    mapper = new Constructor();
    mapper.initialize(firebase);

    mappers[mapper.mapperName] = mapper;
};

app.plug({
    name: 'MapperPlugin',

    plugContext: function (options) {
        return {
            plugActionContext: function (actionContext) {
                actionContext.getMapper = function(mapper) {
                    return mappers[mapper.mapperName];
                };
            }
        };
    }
});*/

app.registerStore(require('./stores/UserStore'));
app.registerStore(require('./stores/BookingStore'));

module.exports = app;
