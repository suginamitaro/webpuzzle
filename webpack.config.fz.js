const path = require('path');
module.exports = {
    entry: {
        fz: './web/factor/src/fz.js',
    },
    output: {
        path:     path.join(__dirname, 'web/factor/app'),
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
