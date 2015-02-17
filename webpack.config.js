'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var querystring = require('querystring');
var path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        path: 'public',
        filename: 'index.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    copyContext: __dirname,
    module: {
        loaders: [
            {test: /\.jsx$/, loader: 'jsx'},
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css')},
            {test: /\.html/, loader: 'copy'},
            {test: /\.(svg|ttf|woff2?|eot)$/, loader: 'file'}
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'FIREBASE': "'https://sky-squash.firebaseio.com/'"
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new ExtractTextPlugin('index.css', {
            allChunks: true
        })
    ]
};
