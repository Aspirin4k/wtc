import React, { Component } from 'react';

import { APIContext } from "./api-context";
import { Preloader } from "../ui/Preloader";

export const withAPI = ({url}) => (WrappedComponent) => {
    const wrapper = class extends Component {
        constructor(props, context) {
            super(props, context);

            this.MIN_TIMEOUT = 250;

            this.url = url;
            this.fetch = this.fetch.bind(this);
            this.loadDataToContext = this.loadDataToContext.bind(this);
            this.getURL = this.getURL.bind(this);
            context.saveFetch(this.fetch);
        }

        fetch() {
            const url = this.getURL();
            return this.context.axios.get(url);
        }

        loadDataToContext() {
            // Прелодер показывается минимум n мс,
            // чтобы пользователь не умер от эпилепсии
            const minWait = new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, this.MIN_TIMEOUT)
            });

            Promise.all([this.fetch(), minWait])
                .then((values) => {
                    const response = values[0];
                    const url = this.getURL();
                    this.context.save(url, response.data);
                })
        }

        getURL() {
            let url = this.url;
            if (typeof url !== 'string') {
                url = url(this.props || {});
            }

            return url;
        }

        componentDidMount() {
            const url = this.getURL();
            if (!this.context.fetch_results[url]) {
                this.loadDataToContext()
            }
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            const url = this.getURL();
            if (!this.context.fetch_results[url]) {
                this.loadDataToContext()
            }
        }

        render() {
            const url = this.getURL();
            return !!this.context.fetch_results[url]
                ? <WrappedComponent {...this.props} {...this.context.fetch_results[url]} />
                : <Preloader />
        }
    };

    wrapper.contextType = APIContext;
    return wrapper;
}