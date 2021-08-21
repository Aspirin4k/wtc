import React, { Component, Fragment } from 'react';
import { CSSTransition } from 'react-transition-group';

import {Title} from "../title/Title";
import {Pages} from "../pages/Pages";
import {withAPI} from "../../api/api";

class MainClass extends Component {
    render() {
        const { items, total } = this.props;
        const pages_count = Math.floor(total / 15) + 1;
        const current_page = parseInt(this.props.match.params.num || '1');

        return <Fragment>
            <div className={'page-main'}>
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
                <Pages pages_count={pages_count} current_page={current_page} />
            </div>
        </Fragment>
    }
}

export const Main = withAPI({url: (props) => `/post/${props.match.params.num || 1}`})(MainClass);
