import React from 'react';
import axios from 'axios';
import compression from 'compression';
import express from 'express';
import favicon from 'serve-favicon';
import fs from 'fs';
import path from 'path';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';

import { App } from '../src/App';
import {getStaticURL} from "../src/utils/static";
import {getConfigValue} from "../src/utils/config";
import {LoggerFactory} from "../src/logger/LoggerFactory";
import {registerLoggerMiddleware} from "./middleware/logger-middleware";
import {getClientConfig} from "./config-client-processing";

const app = express();
const port = getConfigValue('server_port');
const environment = getConfigValue('environment');

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'static/icon/favicon.ico')));
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(compression());
registerLoggerMiddleware(app);

if (DEV) {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackConfig = require('../webpack/webpack.config.dev');
    const compiler = webpack(webpackConfig);

    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: webpackConfig.output.publicPath,
            writeToDisk: true
        })
    );

    app.use(
        webpackHotMiddleware(compiler, {
            log: console.log
        })
    );
}

const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'static/manifest.json')));
Object.keys(manifest).forEach((key) => {
    manifest[key] = getStaticURL(manifest[key]);
});

const axiosInstance = axios.create({
    baseURL: getConfigValue('api_url')
});
app.get('*', (req, res) => {
    res.set('x-environment', environment);

    try {
        const url = req.originalUrl;
        const routerContext = {};
        const fetches = [];
        renderToString(
            <StaticRouter
                location={url}
                context={routerContext}
            >
                <App axios={axiosInstance} saveFetch={(fetch) => {fetches.push(fetch)}} />
            </StaticRouter>
        );

        if (routerContext.url) {
            LoggerFactory.getLogger().info('Redirect', {to: routerContext.url});
            return res.redirect(301, routerContext.url);
        }

        Promise.all(fetches.map(fetch => fetch())).then(
            (responses) => {
                const fetch_results = responses.reduce((acc, response) => {
                    acc[response.config.url] = response.data;
                    return acc;
                }, {});

                const content = renderToString(
                    <StaticRouter
                        location={url}
                        context={routerContext}
                    >
                        <App axios={axiosInstance} fetch_results={fetch_results} />
                    </StaticRouter>
                );

                const cache = {
                    fetch_results
                };
                const clientConfig = getClientConfig();
                return res.render('index', {content, cache, manifest, config: clientConfig});
            }
        ).catch((error) => {
            LoggerFactory.getLogger().error('Server error', {error});
            return res.status(500).send(error.response && error.response.data || error);
        })
    } catch (error) {
        LoggerFactory.getLogger().error('Server error', {error});
        return res.status(500).send(error.response && error.response.data || error);
    }
});

app.listen(port, () => {
    LoggerFactory.getLogger().info(`Started server on port ${port}`, getConfigValue('environment'));
});