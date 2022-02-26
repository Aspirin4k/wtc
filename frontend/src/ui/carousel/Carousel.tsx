import React, { Component } from 'react';
import { getClassName } from '../../utils/class-names';
import { getStaticURL } from '../../utils/static';
import { Image } from '../image/Image';

interface CarouselProps {
  images: {
    previewUrl: string,
    originalUrl: string | null,
  }[],
}

interface CarouselState {
  current: number,
}

export class Carousel extends Component<CarouselProps, CarouselState> {
  height: number | null = null;

  constructor(props) {
    super(props);

    this.state = {
      current: 0,
    }
    this.initHeight = this.initHeight.bind(this);
  }

  initHeight(event: any): void {
    if (null !== this.height) {
      return;
    }

    this.height = event.target.height;
  }

  changeSlide(direction: number) {
    const { images } = this.props;
    let { current } = this.state;
    current += direction;
    if (current < 0) {
      current = images.length + current;
    } else if (current >= images.length) {
      current = current % images.length;
    }

    this.setState({current});
  }

  setSlide(slide: number) {
    this.setState({
      current: slide
    })
  }

  render() {
    const { height } = this;
    const { images } = this.props;
    const { current } = this.state;

    return <div className={'carousel'}>
      <div tabIndex={0} className={'carousel-back'} onClick={() => this.changeSlide(-1)} />
      <div className={'carousel-back-icon'}>
        <img src={getStaticURL('/icon/arrow-next.svg')} />
      </div>
      {
        images.map(
          (image, index) => {
            return <Image
              className={getClassName({ 'carousel-item': true, 'carousel-item_current': index === current })}
              key={image.previewUrl}
              onLoad={this.initHeight}
              height={height}
              originalUrl={image.originalUrl}
              previewUrl={image.previewUrl}
            />
          }
        )
      }
      <div className={'carousel-dots'}>
        {
          images.map((image, index) => <div
            className={getClassName({'carousel-dots-dot': true, 'carousel-dots-dot_current': index === current})}
            onClick={() => {
              if (index !== current) {
                this.setSlide(index);
              }
            }}
            key={image.previewUrl}
          />)
        }
      </div>
      <div className={'carousel-next-icon'}>
        <img src={getStaticURL('/icon/arrow-next.svg')} />
      </div>
      <div tabIndex={0} className={'carousel-next'} onClick={() => this.changeSlide(1)} />
    </div>
  }
}