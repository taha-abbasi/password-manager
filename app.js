console.log('starting password manager');

var crypto = require('crypto-js');
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
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Master password',
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
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Master password',
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

function getAccounts (masterPassword) {
    // use getItemSync to fetch accounts
    var encryptedAccounts = storage.getItemSync('accounts');
    var accounts = [];

    // decrypt
    if (typeof encryptedAccounts !=='undefined') {
        var bytes = crypto.AES.decrypt(encryptedAccounts, masterPassword);
        var accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }

    // return accounts array
    return accounts;
}

function saveAccounts (accounts, masterPassword) {
    // encrypt accounts
    var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

    // setItemSync
    storage.setItemSync('accounts', encryptedAccounts.toString());

    // return accounts
    return accounts;
}

function createAccount (account, masterPassword) {
    var accounts = getAccount(masterPassword);

    if (typeof accounts === 'undefined') {
        accounts = [];
    }

    accounts.push(account);

    saveAccounts(accounts, masterPassword);

    return account;
}

function getAccount (accountName, masterPassword) {
    var accounts = getAccounts(masterPassword);
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
    }, argv.masterPassword);

    console.log('Account Created!');
    console.log(createdAccount);

} else if (command === 'get' && typeof argv.name != 'undefined') {
    var fetchedAccount = getAccount(argv.name, argv.masterPassword);

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