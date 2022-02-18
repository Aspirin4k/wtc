import React, { Component } from 'react';
import { getClassName } from '../../utils/class-names';
import { getStaticURL } from '../../utils/static';

interface CarouselProps {
  images: string[],
}

interface CarouselState {
  current: number,
}

export class Carousel extends Component<CarouselProps, CarouselState> {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
    }
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

  render() {
    const { images } = this.props;
    const { current } = this.state;

    return <div className={'carousel'}>
      <div tabIndex={0} className={'carousel-back'} onClick={() => this.changeSlide(-1)} />
      <div className={'carousel-back-icon'}>
        <img src={getStaticURL('/icon/arrow-next.svg')} />
      </div>
      {
        images.map(
          (image, index) => <img
            className={getClassName({'carousel-item': true, 'carousel-item_current': index === current})}
            key={image}
            src={image}
          />
        )
      }
      <div className={'carousel-dots'}>
        {
          images.map((image, index) => <div
            className={getClassName({'carousel-dots-dot': true, 'carousel-dots-dot_current': index === current})}
            key={image}
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