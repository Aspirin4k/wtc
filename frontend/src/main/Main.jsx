import React, { Component, Fragment } from 'react';
import { CSSTransition } from 'react-transition-group';

import {Title} from "./Title";
import {Pages} from "./Pages";
import {withAPI} from "../api/api";

class MainClass extends Component {
    render() {
        const { titles, pages_count } = this.props;

        return <Fragment>
            <Pages pages_count={pages_count} />
            {
                (titles || []).map((title, index) => {
                    return <CSSTransition
                        in={true}
                        key={title.id}
                        classNames='title'
                        timeout={100 * index}
                        unmountOnExit
                        appear
                    >
                        <Title
                            title={title}
                            isFirst={index === 0}
                            isLast={index === titles.length - 1}
                        />
                    </CSSTransition>
                })
            }
            <Pages pages_count={pages_count} />
        </Fragment>
    }
}

export const Main = withAPI({url: (props) => `/page/${props.match.params.num}`})(MainClass);
