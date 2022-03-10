const path = require('path');
module.exports = {
    entry: {
        hidden: './web/n/src/hidden.js',
        locked: './web/n/src/locked.js',
        tuple: './web/n/src/tuple.js',
    },
    output: {
        path:     path.join(__dirname, 'web/n/app'),
        filename: '[name]-main.js'
    }
}
