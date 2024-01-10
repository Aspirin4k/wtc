import React, {Component} from 'react';
import {Switch, Route, withRouter, RouteComponentProps} from 'react-router-dom';

import {APIContext} from './api/api-context';
import {Main} from './main/main/Main';
import {Background} from "./ui/background/Background";
import {AxiosInstance} from "axios";
import {Header} from "./ui/header/Header";
import {Footer} from "./ui/footer/Footer";
import {getStaticURL} from "./utils/static";
import { User } from './utils/authorization';
import { GameList } from './chessboard/GameList';

type AppProps = RouteComponentProps & {
    user_session: User,
    saveFetch: () => void,
}

interface AppState {
    axios: AxiosInstance,
    fetches: any[],
    fetch_results: any,
    save: (url: string, data: any) => void,
    saveFetch: () => void
}

class AppComponent extends Component<AppProps, AppState> {
    constructor(props) {
        super(props);

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
    }

    getBackground() {
        const current_date = new Date();
        const current_time = current_date.getUTCHours();
        switch (true) {
            case this.props.location.pathname.includes('/chessboard'):
                return 'tea_room.webp';
            case current_time >= 14 && current_time < 19:
                return 'hm_evening.webp';
            case current_time >= 19 || current_time <= 4:
                return 'hm_night.webp';
            default:
                return 'hm_day.webp';
        }
    }

    render() {
        const background_image = this.getBackground();
        const { props } = this;
        const { user_session } = props;

        return <APIContext.Provider value={this.state}>
            <Background page_url={getStaticURL(`/background/${background_image}`)} />
            <Header user={user_session} />
            <div className={'page'}>
                <div className='content'>
                    <Switch>
                        <Route path='/chessboard' render={(props) => {
                            // @ts-ignore
                            return <GameList {...props.location.state} />}
                         } />
                        <Route path='/page/:num' component={Main} />
                        <Route path='/' component={Main} />
                    </Switch>
                </div>
            </div>
            <Footer />
        </APIContext.Provider>
    }
}

export const App = withRouter(AppComponent);
