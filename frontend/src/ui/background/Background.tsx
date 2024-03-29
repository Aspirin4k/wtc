import React, { Component } from 'react';

interface BackgroundProps {
    page_url: string
}

interface BackgroundState {
}

class Background extends Component<BackgroundProps, BackgroundState> {
    render() {
        const {page_url} = this.props;
        return <div className={'page-background'}>
            <div className={'page-background-image'}>
                <img src={page_url} />
            </div>
            <div className={'page-background-lower'}>
                <div className={'page-background-lower__invisible'} />
                <div className={'page-background-lower__fill'}>
                    <div className={'page-background-lower__fill__color'} />
                </div>
            </div>
        </div>;
    }
}

export {
    Background
}