const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { DefinePlugin } = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, '../server/index.js'),
    target: 'node',
    node: {
        __filename: false,
        __dirname: false
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, '../dist'),
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
    },
    externals: [nodeExternals()],
    mode: 'production',
    plugins: [
        new DefinePlugin({
            DEV: false,
            SERVER: true,
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../server/view'), to: 'views' }
            ]
        })
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
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            }
        ]
    }
};