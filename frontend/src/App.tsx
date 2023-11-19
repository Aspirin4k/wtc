import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Cookies from 'js-cookie';

import {APIContext} from './api/api-context';
import {Main} from './main/main/Main';
import {Background} from "./ui/background/Background";
import {AxiosInstance} from "axios";
import {Header} from "./ui/header/Header";
import {Footer} from "./ui/footer/Footer";
import {ChessboardResolver} from "./chessboard/ChessboardResolver";
import {getStaticURL} from "./utils/static";
import { isServer } from './utils/version';
import { User } from './utils/authorization';

interface AppProps {
    saveFetch: () => void
}

interface AppState {
    axios: AxiosInstance,
    fetches: any[],
    fetch_results: any,
    save: (url: string, data: any) => void,
    saveFetch: () => void
}

class App extends Component<AppProps, AppState> {
    background_image: string = 'hm_day.webp';
    user_session: User | null;

    constructor(props) {
        super(props);

        this.user_session = this.getUserSession();
        this.state = {
            axios: props.axios,
            fetches: [],
            fetch_results: props.fetch_results || {},
            save: (url, data) => {
                this.setState((state) => {
                    return {
                        ...state,
                        fetch_results: {
                            ...state.fetch_results,
                            [url]: data
                        }
                    };
                })
            },
            saveFetch: this.props.saveFetch || (() => {})
        }

        this.initBackground();
    }

    getUserSession(): User | null {
        if (isServer()) {
            return null;
        }

        const query = new URLSearchParams(document.location.search);
        const token = query.get('token');
        if (!token) {
            const cookiesToken = Cookies.get('auth_token');
            return !cookiesToken ? null : this.getParsedToken(cookiesToken);
        }

        const parsedPayload = this.getParsedToken(token);
        Cookies.set('auth_token', token, {expires: new Date(parsedPayload.exp * 1000), path: ''});
        history.replaceState({}, null, document.location.href.split('?')[0]);
        return parsedPayload;
    }

    getParsedToken(token: string): User | null {
        const payload = token.split('.')[1] || null;
        if (!payload) {
            return null;
        }

        let parsedPayload;
        try {
            parsedPayload = JSON.parse(atob(payload));
        } catch (e) {
            return null;
        }

        return parsedPayload;
    }

    initBackground() {
        const current_date = new Date();
        const current_time = current_date.getUTCHours();
        switch (true) {
            case current_time >= 14 && current_time < 19:
                this.background_image = 'hm_evening.webp';
                break;
            case current_time >= 19 || current_time <= 4:
                this.background_image = 'hm_night.webp';
                break;
            default:
                this.background_image = 'hm_day.webp';
                break;
        }
    }

    render() {
        const { background_image, user_session } = this;

        return <APIContext.Provider value={this.state}>
            <Background page_url={getStaticURL(`/background/${background_image}`)} />
            <Header user={user_session} />
            <div className={'page'}>
                <div className='content'>
                    <Switch>
                        <Route path='/chessboard' component={ChessboardResolver} />
                        <Route path='/page/:num' component={Main} />
                        <Route path='/' component={Main} />
                    </Switch>
                </div>
            </div>
            <Footer />
        </APIContext.Provider>
    }
}

export { App };
