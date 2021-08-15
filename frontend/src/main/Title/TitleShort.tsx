import React, { Component } from "react";

interface TitleShortProps {
    content: string,
    url: string,
    is_first: boolean,
    is_last: boolean
}

interface TitleShortState {

}

class TitleShort extends Component<TitleShortProps, TitleShortState> {
    render() {
        const {content, url, is_first, is_last} = this.props;

        return <a className={'title'} target={'_blank'} href={url}>
            <div className={'title-post' + (is_first ? ' title-post_first' : '') + (is_last ? ' title-post_last' : '')}>
                <div className="title-post-info">
                    <h2 className="title-post-info-header">{ content }</h2>
                </div>
            </div>
        </a>;;
    }
}

export { TitleShort }