console.log('starting password manager');

var storage = require('node-persist');
storage.initSync();

// create
//      --name
//      --username
//      --password

// get
//      --name

var argv = require('yargs')
    .command('create', 'Creates an account', function (yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Enter an account name',
                type: 'string'
            },
            username: {
                demand: true,
                alias: 'u',
                description: 'Your username goes here',
                type: 'string'
            },
            password: {
                demand: true,
                alias: 'p',
                description: 'Your password goes here',
                type: 'string'
            }
        }).help('help');
    })
    .command('get', 'Retrieves an account', function (yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Enter an account name',
                type: 'string'
            }
        }).help('help');
    })
    .help('help')
    .argv;
var command = argv._[0];

// account.name Facebook
// account.username User12!
// account.password Password123!

function createAccount (account) {
    var accounts = storage.getItemSync('accounts');

    if (typeof accounts === 'undefined') {
        accounts = [];
    }

    accounts.push(account);
    storage.setItemSync('accounts', accounts);

    return account;
}

function getAccount (accountName) {
    var accounts = storage.getItemSync('accounts');
    var matchedAccount;

    if (typeof accounts != 'undefined') {
        accounts.forEach(function (account) {
            if (account.name === accountName) {
                matchedAccount = account;
            }
        });
    }

    return matchedAccount;
}


if (command === 'create' &&
    typeof argv.name != 'undefined' &&
    typeof argv.username  != 'undefined' &&
    typeof argv.password  != 'undefined') {

    var createdAccount = createAccount({
        name: argv.name,
        username: argv.username,
        password: argv.password
    });

    console.log('Account Created!');
    console.log(createdAccount);

} else if (command === 'get' && typeof argv.name != 'undefined') {
    var fetchedAccount = getAccount(argv.name);

    if (typeof fetchedAccount === 'undefined') {
        console.log(('Account not found!'));
    } else {
        console.log('Account found!');
        console.log(
            'Account Name: ' + fetchedAccount.name + '\n' +
            'Username: ' + fetchedAccount.username + '\n' +
            'Password: ' + fetchedAccount.password
        );
    }
}