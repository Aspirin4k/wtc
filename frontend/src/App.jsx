import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {APIContext} from './api/api-context';
import {Main} from './main/Main';
import {Post} from './post/Post';

class App extends Component {
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

    render() {
        return <APIContext.Provider value={this.state}>
            <div>
                <a href='/'> DOMOI </a>
            </div>
            <div className='content'>
                <Switch>
                    <Route path='/page/:num' component={Main} />
                    <Route path='/post/:num' component={Post} />
                    <Route path='/'>
                        <Redirect to='/page/0' />
                    </Route>
                </Switch>
            </div>
            <div id='footer'>
                &copy; Все права защищены СНГ сообществом ценителей работ
                Рюкиси07
                <p>
                    Читать посты в формате <a href='/feed.xml'> RSS </a>
                </p>
            </div>
        </APIContext.Provider>
    }
}

export { App };
