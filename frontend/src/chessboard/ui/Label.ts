import { Text, Container as CreateJSContainer, Shadow } from 'createjs-module';

import { Element } from './Element';

import type { ElementOptions } from './Element';
import { ExactPosition, Size } from './Interfaces';

type LabelOptions = ElementOptions & {
  text: string,
  font?: string,
  color?: string,
  fontSize?: number,
  shadow?: {
    color: string,
    x?: number,
    y?: number,
    blur?: number,
  },
  align_horizontal?: 'center' | 'left',
  align_vertical?: 'middle' | 'top',
}

export class Label extends Element {
  private readonly DEFAULT_FONT = 'Arial';
  private readonly DEFAULT_FONT_SIZE = 20;
  private readonly DEFAULT_COLOR = 'black';

  protected renderObject: Text;
  private readonly options: LabelOptions;

  constructor(options: LabelOptions) {
    super(options)
    
    this.options = options;
    this.renderObject = new Text(
      options.text,
      `${options.fontSize || this.DEFAULT_FONT_SIZE}px ${options.font || this.DEFAULT_FONT}`
    );

    this.renderObject.color = options.color || this.DEFAULT_COLOR;
    this.renderObject.name = 'Label';

    if (options.shadow) {
      const shadowOptions = options.shadow;
      const shadow = new Shadow(shadowOptions.color, shadowOptions.x || 0, shadowOptions.y || 0, shadowOptions.blur || 5);
      this.renderObject.shadow = shadow;
    }
  }
  
  public getSize(): Size {
      return {
        width: this.renderObject.getMeasuredWidth(),
        height: this.renderObject.getMeasuredHeight()
      }
  }

  public addToStage(stage: CreateJSContainer, position: ExactPosition = null): void {
    this.renderObject.lineWidth = !this.options?.size?.width ? stage.getBounds()?.width : this.options.size.width;

    super.addToStage(stage, position);
  }
}