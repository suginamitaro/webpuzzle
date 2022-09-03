const path = require('path');
module.exports = {
    entry: {
        np6: './web/n/src/np6.js',
        np9: './web/n/src/np9.js',
        hidden: './web/n/src/hidden.js',
        locked: './web/n/src/locked.js',
        tuple: './web/n/src/tuple.js',
        test: './web/n/src/test.js',
    },
    output: {
        path:     path.join(__dirname, 'web/n/app'),
        filename: '[name]-main.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    devtool: 'source-map'
}
