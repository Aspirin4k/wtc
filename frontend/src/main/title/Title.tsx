import React, {Component} from "react";
import { getClassName } from '../../utils/class-names';
import { Carousel } from '../../ui/carousel/Carousel';
import { EscapeHTML, ReplaceByTags, ReplaceMentions, SubstrBySentences } from '../../utils/strings';

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
        const hasMultipleImages = title.photos.length > 1
        const url = `https://vk.com/wall-${title.communityId}_${title.id}`;
        const photo_url = hasImage && title.photos[0].urlMedium;
        const original_content = EscapeHTML(title.content);

        let header = '';
        let content = '';
        let was_cut: boolean;
        [header, was_cut] = SubstrBySentences(original_content);
        if (was_cut) {
            header = '';
            content = original_content;
        } else {
            content = original_content.substr(header.length);
            let i: number;
            for (i = 0; i < content.length && content[i] === "\n"; i++) {}
            if (i < content.length) {
                content = content.substr(i);
            }
        }

        // делаю тут, чтобы не парится, когда разбиение на предложения делит тег пополам
        header = ReplaceMentions(ReplaceByTags(header));
        content = ReplaceMentions(ReplaceByTags(content));

        return <div className={getClassName({
            'title-post': true,
            'title-post_first': isFirst,
            'title-post_last': isLast,
            'title-post_horizontal': !hasMultipleImages,
            'title-post_vertical': hasMultipleImages,
        })}>
            {
                photo_url && !hasMultipleImages &&
                <div className="title-post-preview">
                    <img src={photo_url} className="title-post-preview-img"/>
                </div>
            }
            <div className="title-post-info">
                { '' !== header && <h2 className="title-post-info-header" dangerouslySetInnerHTML={{__html: header}} /> }
                { '' !== content && <p className="title-post-info-text" dangerouslySetInnerHTML={{__html: content}} /> }
                { !hasMultipleImages && <p><a href={url}>Источник</a></p> }
            </div>
            {
                hasMultipleImages &&
                <Carousel images={title.photos.map((photo) => photo.urlMedium)} />
            }
            { hasMultipleImages && <div className={'title-post-source'}><p><a href={url}>Источник</a></p></div> }
        </div>;
    }
}

export { Title }