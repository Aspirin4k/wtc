import React, {Component} from "react";

interface TitleLongProps {
    title: {
        photos: {
            urlMedium: string
        }[],
        content: string,
        communityId: number,
        id: number
    },
    isFirst: boolean,
    isLast: boolean
}

interface TitleLongState {

}

class Title extends Component<TitleLongProps, TitleLongState> {
    render() {
        const { title, isFirst, isLast } = this.props;

        const hasImage = !!title.photos.length;
        const isLongTitle = title.content.length >= 180;
        const url = `https://vk.com/wall-${title.communityId}_${title.id}`;
        const photo_url = hasImage && title.photos[0].urlMedium;
        const content = title.content;

        return <a className={'title'} target={'_blank'} href={url}>
            <div className={'title-post' + (isFirst ? ' title-post_first' : '') + (isLast ? ' title-post_last' : '')}>
                {
                    photo_url &&
                    <div className="title-post-preview">
                        <img src={photo_url} className="title-post-preview-img"/>
                    </div>
                }
                <div className="title-post-info">
                    { !isLongTitle && <h2 className="title-post-info-header">{ content }</h2> }
                    { isLongTitle && <p className="title-post-info-text">{ content }</p> }
                </div>
            </div>
        </a>;
    }
}

export { Title }