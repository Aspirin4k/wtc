import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Title extends Component {
    render() {
        const { title, isFirst, isLast } = this.props;
        const hasImage = !!title.photos.length;
        return <a className={'title'} target={'_blank'} href={`https://vk.com/wall-${title.communityId}_${title.id}`}>
            <div className={'title-post' + (isFirst ? ' title-post_first' : '') + (isLast ? ' title-post_last' : '')}>
                {
                    hasImage &&
                    <div className="title-post-preview">
                        <img src={title.photos[0].urlLarge} className="title-post-preview-img"/>
                    </div>
                }
                <div className="title-post-info">
                    <h2 className="title-post-info-header">{ title.title }</h2>
                    <p className="title-post-info-text">{ title.content }</p>
                    <span className="title-post-info-shadow" />
                </div>
            </div>
        </a>;
    }
}

export { Title };
