const path = require('path');

const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, '../dist-dev/static'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new WebpackManifestPlugin(),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../assets'), to: ''}
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            }
        ]
    }
};