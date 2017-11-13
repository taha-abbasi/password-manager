console.log('starting password manager');

var storage = require('node-persist');
storage.initSync();

// storage.setItemSync('accounts', [{
//     username: 'Andrew',
//     balance: 0
// }]);

var accounts = storage.getItemSync('accounts');

console.log(accounts);

// accounts.push({
//     username: 'James',
//     balance: 100
// });
//
// storage.setItemSync('accounts', accounts);

