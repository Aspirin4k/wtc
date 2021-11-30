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
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    mode: 'development',
    devtool: 'inline-source-map',
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
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: ['react-hot-loader/webpack', 'babel-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    "sass-loader",
                ],
            }
        ]
    }
};