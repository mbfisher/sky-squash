var Firebase = require('firebase');
var _ = require('lodash');
var root = new Firebase('https://sky-squash.firebaseio.com/');

root.child('bookings').on('value', function (snapshot) {
    var bookings = snapshot.val();

    _.each(bookings, function (booking, id) {
        if (!booking.cost || !booking.courts) {
            console.log(new Date(booking.time*1000), booking.id);
        }
    });
});
