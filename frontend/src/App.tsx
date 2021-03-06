import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';

import {APIContext} from './api/api-context';
import {Main} from './main/main/Main';
import {Background} from "./ui/background/Background";
import {AxiosInstance} from "axios";
import {Header} from "./ui/header/Header";
import {Footer} from "./ui/footer/Footer";
import {ChessboardResolver} from "./chessboard/ChessboardResolver";
import {getStaticURL} from "./utils/static";

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

        this.initBackground();
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
        const { background_image } = this;

        return <APIContext.Provider value={this.state}>
            <Background page_url={getStaticURL(`/background/${background_image}`)} />
            <Header />
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
