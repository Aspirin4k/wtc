import React, { Component } from 'react';
import {TitleLong} from "./TitleLong";
import {TitleShort} from "./TitleShort";

class Title extends Component {
    render() {
        const { title, isFirst, isLast } = this.props;

        const hasImage = !!title.photos.length;
        const isLongTitle = title.content.length >= 120;
        const url = `https://vk.com/wall-${title.communityId}_${title.id}`;

        return isLongTitle
            ? <TitleLong
                    title={title.title}
                    content={title.content}
                    photo_url={hasImage &&title.photos[0].urlMedium }
                    url={url}
                    is_first={isFirst}
                    is_last={isLast}
                />
            : <TitleShort
                    content={title.content}
                    url={url}
                    is_first={isFirst}
                    is_last={isLast}
            />
    }
}

export { Title };
