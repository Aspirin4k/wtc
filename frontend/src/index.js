import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter } from "react-router-dom";

import config from '../config/env.json';
import { App } from "./App";
import './index.scss';

const axiosInstance = axios.create({
    baseURL: config.api
})
const cache = window.cache || {};
const wrapper = document.getElementById('application');
ReactDOM.render(
    <BrowserRouter>
        <App axios={axiosInstance} fetch_results={cache} />
    </BrowserRouter>,
    wrapper
);