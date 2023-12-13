import { Shape } from 'createjs-module';
import { Container, ContainerOptions } from './Container';
import { Label } from './Label';

type ButtonOptions = ContainerOptions<string> & {
  text: string,
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
        })
      ]
    );
  }
}