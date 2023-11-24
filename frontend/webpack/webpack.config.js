const path = require('path');

const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { DefinePlugin } = require('webpack');

module.exports = {
    entry: [path.resolve(__dirname, '../src/index.js')],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '../dist/static'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            'winston': false
        }
    },
    mode: 'production',
    plugins: [
        new DefinePlugin({
            SERVER: false,
        }),
        new CleanWebpackPlugin({
            verbose: true
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../assets'), to: ''}
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new WebpackManifestPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
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