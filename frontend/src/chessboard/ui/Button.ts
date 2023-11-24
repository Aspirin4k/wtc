import { Shape } from 'createjs-module';
import { Container, ContainerOptions } from './Container';
import { Label } from './Label';

type ButtonOptions = ContainerOptions & {
  text: string,
  on_click: () => void,
}

export class Button extends Container {
  constructor(options: ButtonOptions) {
    super(
      {
        ...options,
        background: 'grey'
      },
      [
        new Label({
          size: options.size,
          text: options.text,
          align_horizontal: 'center',
          align_vertical: 'middle'
        })
      ]
    );

    if (options.on_click) {
      const hitArea = new Shape();
      hitArea.graphics.beginFill('#000').drawRect(0, 0, this.getSize().width, this.getSize().height);
      this.renderObject.hitArea = hitArea;
      this.renderObject.on('click', options.on_click);
    }
  }
}