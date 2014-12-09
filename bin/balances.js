var Firebase = require('firebase');
var root = new Firebase('https://sky-squash.firebaseio.com/');

root.child('users').on('value', function (snapshot) {
    var users = snapshot.val();

    root.child('transactions').on('value', function (snapshot) {
        var transactions = snapshot.val();

        Object.keys(transactions).forEach(function (uid) {
            var user = users[uid];

            var balance = 0;
            Object.keys(transactions[uid]).forEach(function (id) {
                var transaction = transactions[uid][id];
                if (transaction.type === 'credit') {
                    balance -= transaction.value;
                } else {
                    balance += transaction.value;
                }
            });

            console.log(user.displayName, '£'+balance.toFixed(2));
        });
    });
});
