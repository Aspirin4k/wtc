import React, {Component} from "react";

interface TitleLongProps {
    title: string,
    content: string,
    photo_url: string | null,
    url: string,
    is_first: boolean,
    is_last: boolean
}

interface TitleLongState {

}

class TitleLong extends Component<TitleLongProps, TitleLongState> {
    render() {
        const {title, content, photo_url, url, is_first, is_last} = this.props;

        return <a className={'title'} target={'_blank'} href={url}>
            <div className={'title-post title-post_long ' + (is_first ? ' title-post_first' : '') + (is_last ? ' title-post_last' : '')}>
                {
                    photo_url &&
                    <div className="title-post-preview">
                        <img src={photo_url} className="title-post-preview-img"/>
                    </div>
                }
                <div className="title-post-info">
                    <h2 className="title-post-info-header">{ title }</h2>
                    <p className="title-post-info-text">{ content }</p>
                    <span className="title-post-info-shadow" />
                </div>
            </div>
        </a>;
    }
}

export { TitleLong }