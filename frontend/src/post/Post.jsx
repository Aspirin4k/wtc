import React, {Component, Fragment} from 'react';
import {withAPI} from "../api/api";

class PostClass extends Component {
    render() {
        const { date, author, body, att, tags } = this.props;

        return <Fragment>
            <div className="date">Дата написания статьи: {date} </div>
            <div className="author">Автор: <a href={author[0]}> {author[1]} </a></div>
            {body}
            {
                att.map((at, index) => {
                    return <p key={index}>
                        <img width="800" src={at.url} alt={at.url} />
                    </p>
                })
            }
            Теги:
            <ul>
                {
                    tags.map((tag, index) => {
                        return <li key={index}><a href={`/tag/${tag.name}`}>{tag.name}</a></li>
                    })
                }
            </ul>
        </Fragment>
    }
}

export const Post = withAPI({url: (props) => `/post/${props.match.params.num}`})(PostClass);