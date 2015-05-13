'use strict';

var Firebase = require('firebase');
var _ = require('lodash');

var name = process.argv.splice(2).join(' ');
var uid = 'manual:'+name.replace(' ', '-');

var ref = new Firebase('http://sky-squash.firebaseio.com');
ref.child('users').child(uid).set({
    uid: uid,
    displayName: name
}, process.exit);
