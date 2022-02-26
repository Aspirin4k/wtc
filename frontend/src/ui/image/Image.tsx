import React, { Component } from 'react';

import type { ReactNode } from 'react';

type ImageProps = {
  previewUrl: string,
  originalUrl: string | null,
  className?: string | null,
  height?: number | null,
  onLoad?: (event: any) => void,
}

type ImageState = {
}

export class Image extends Component<ImageProps, ImageState> {
  constructor(props: ImageProps) {
    super(props);

    this.wrapLink = this.wrapLink.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  onLoad(event: any): void {
    const { onLoad } = this.props;
    onLoad && onLoad(event);
  }

  wrapLink(element: ReactNode): ReactNode {
    const { originalUrl } = this.props;

    return <a href={originalUrl} target={'_blank'}>
      {element}
    </a>
  }

  render() {
    const { onLoad } = this;
    const { originalUrl, previewUrl, height, className } = this.props;
    const hasOriginal = originalUrl !== null;

    let wrap = (element: ReactNode) => element;
    if (hasOriginal) {
      wrap = this.wrapLink;
    }

    return wrap(
      <img
        className={className || ''}
        style={{
          height: null === height ? 'auto' : (height + 'px')
        }}
        src={previewUrl}
        onLoad={onLoad}
      />
    )
  }
}