import React, { Component, Fragment } from 'react';
import { CSSTransition } from 'react-transition-group';

import {Title} from "./Title";
import {Pages} from "./Pages";
import {withAPI} from "../api/api";

class MainClass extends Component {
    render() {
        const { items, total } = this.props;
        const pages_count = Math.floor(total / 50) + 1;

        return <Fragment>
            <div className={'page-main'}>
                <Pages pages_count={pages_count} />
                {
                    (items || []).map((title, index) => {
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
                                isLast={index === items.length - 1}
                            />
                        </CSSTransition>
                    })
                }
                <Pages pages_count={pages_count} />
            </div>
        </Fragment>
    }
}

export const Main = withAPI({url: (props) => `/post/${props.match.params.num || 1}`})(MainClass);
