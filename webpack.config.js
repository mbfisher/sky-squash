'use strict';

var webpack = require('webpack');

module.exports = {
    entry: './react/index.js',
    output: {
        path: 'public',
        filename: 'index.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {test: /\.jsx$/, loader: 'jsx-loader'},
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'FIREBASE': "'https://sky-squash.firebaseio.com/'"
        })
    ]
};
