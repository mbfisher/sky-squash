var Firebase = require('firebase');
var root = new Firebase('https://sky-squash.firebaseio.com/');

root.child('users').on('value', function (snapshot) {
    var users = snapshot.val();

    var balances = {};
    root.child('bookings').on('value', function (snapshot) {
        var bookings = snapshot.val();

        Object.keys(bookings).forEach(function (id) {
            var booking = bookings[id];

            if (!booking.cost) {
                return;
            }

            booking.players = booking.players || [];
            var totalPlayers = 0;

            Object.keys(booking.players).forEach(function (uid) {
                totalPlayers += 1 + booking.players[uid].guests;
            });

            var costPerPlayer = booking.cost / totalPlayers;

            Object.keys(booking.players).forEach(function (uid) {
                var options = booking.players[uid];

                if (balances[uid] === undefined) {
                    balances[uid] = {
                        bookings: 0,
                        credit: 0,
                        debit: 0
                    };
                }

                balances[uid].bookings += (1 + options.guests) * costPerPlayer;
            });
        });

        root.child('transactions').on('value', function (snapshot) {
            var transactions = snapshot.val();

            Object.keys(transactions).forEach(function (uid) {
                Object.keys(transactions[uid]).forEach(function (id) {
                    var transaction = transactions[uid][id];
                    balances[uid][transaction.type] += transaction.value;
                });
            });

            Object.keys(balances).forEach(function (uid) {
                balances[uid].booking_balance = balances[uid].debit - balances[uid].bookings;
                balances[uid].credit_balance = balances[uid].debit - balances[uid].credit;
                console.log(users[uid].displayName, balances[uid]);
            });
            Object.keys(balances).forEach(function (uid) {
                console.log(users[uid].displayName+' £'+balances[uid].booking_balance.toFixed(2));
            });
        });
    });
});
