const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        background: './src/background/index.js',
        content: './src/content/index.js',
        popup: './src/popup/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlPlugin({
            title: 'Softomate test',
            chunks: ['popup'],
            filename: 'index.html',
            minify: {
                collapseWhitespace: true
            }
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'src', 'manifest.json'),
                to: path.join(__dirname, 'dist')
            },
            {
                from: path.join(__dirname, 'src', 'icon.png'),
                to: path.join(__dirname, 'dist')
            }
        ])
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: /src/,
                loaders: ['babel?presets[]=es2015']
            },
            {
                test: /\.handlebars$/,
                include: /src/,
                loader: 'handlebars-loader'
            },
            {
                test: /\.less/,
                include: /src/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
            }
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        chunkFilename: "[id].js"
    }
};
