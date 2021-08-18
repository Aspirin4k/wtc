import React from 'react';
import axios from 'axios';
import compression from 'compression';
import express from 'express';
import favicon from 'serve-favicon';
import fs from 'fs';
import path from 'path';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';

import config from '../config/env.json';
import { App } from '../src/App';

const app = express();
const port = process.env.SERVER_PORT || config.port;

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'static/icon/favicon.ico')));
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(compression());

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
const axiosInstance = axios.create({
    baseURL: config.api
});
app.get('*', (req, res) => {

    try {
        const routerContext = {};
        const fetches = [];
        renderToString(
            <StaticRouter
                location={req.url}
                context={routerContext}
            >
                <App axios={axiosInstance} saveFetch={(fetch) => {fetches.push(fetch)}} />
            </StaticRouter>
        );

        if (routerContext.url) {
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
                        location={req.url}
                        context={routerContext}
                    >
                        <App axios={axiosInstance} fetch_results={fetch_results} />
                    </StaticRouter>
                );

                return res.render('index', {content, cache: fetch_results, manifest});
            }
        ).catch((error) => {
            return res.send(500, error.response && error.response.data || error);
        })
    } catch (e) {
        return res.send(500, error.response && error.response.data || error);
    }
});

app.listen(port, () => {
    console.log(`Started server on port ${port}`);
    console.log(config);
});