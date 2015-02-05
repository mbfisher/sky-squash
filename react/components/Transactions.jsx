 var transactions;
        if (this.state.showTransactions) {
            transactions = _.map(this.state.transactions.credit, function (transaction) {
                return <p>{transaction.booking.getMoment().format('ddd Do MMM')} | &pound;{transaction.bookingCost.toFixed(2)} | &pound;{transaction.balance.toFixed(2)}</p>;
            });
        }
