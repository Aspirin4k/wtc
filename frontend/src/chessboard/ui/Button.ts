import { RenderingContext } from '../helpers/RenderingContext';
import { Container } from './Container';
import { Label } from './Label';

import type { ElementOptions } from './Element';

type ButtonOptions = ElementOptions & {
  text: string,
  on_click: () => void,
}

export class Button extends Container {
  private on_click: () => void;

  constructor(canvas: HTMLCanvasElement, options: ButtonOptions) {
    super(
      canvas,
      options,
      [
        new Label(canvas, {
          auto_position: {
            horizontal: 'center',
            vertical: 'middle'
          },
          size: options.size,
          text: options.text
        })
      ]
    );

    this.on_click = options.on_click;
  }

  protected onClickContainer(): boolean {
    this.on_click();
    return true;
  }

  protected renderContainer(context: RenderingContext): void {
    this.background(context, 'white');
  }
}