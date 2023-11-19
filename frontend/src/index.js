import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter } from "react-router-dom";
import Cookies from 'js-cookie';

import { App } from "./App";
import { getConfigValue } from "./utils/config";
import { getUserSession } from './utils/authorization';
import './index.scss';

const axiosInstance = axios.create({
    baseURL: getConfigValue('api_url')
});
const cache = window.cache || {};
const wrapper = document.getElementById('application');
ReactDOM.render(
    <BrowserRouter basename={getConfigValue('static_prefix') || '/'}>
        <App 
            axios={axiosInstance} 
            fetch_results={cache.fetch_results || {}} 
            user_session={getUserSession(Cookies.get('auth_token') || null)}
        />
    </BrowserRouter>,
    wrapper
);