import { Container as CreateJSContainer, DisplayObject } from 'createjs-module';

import { ExactPosition, Size } from './Interfaces';

export type ElementOptions = {
  position?: ExactPosition,
  size?: Size,
};

export abstract class Element {
  protected renderObject: DisplayObject;

  protected position: ExactPosition | null = null;
  protected original_position: ExactPosition | null = null;
  protected size: Size;

  protected constructor(options: ElementOptions) {
    if (options.position) {
      this.position = {
        ...options.position
      };
      this.original_position = {
        ...options.position
      };
    }
    this.size = options.size;
  }

  public addToStage(stage: CreateJSContainer, position: ExactPosition = null): void
  {
    position = position || this.position || {x: 0, y: 0};
    this.renderObject.x = position.x;
    this.renderObject.y = position.y;

    console.log(position);

    stage.addChild(this.renderObject);
  }

  hasPosition(): boolean {
    return !!this.position;
  }

  getPosition(): ExactPosition {
    return this.position || {x: 0, y: 0};
  }

  getOriginalPosition(): ExactPosition {
    return this.original_position || {x: 0, y: 0};
  }

  public getSize(): Size {
    const boundaries = this.renderObject.getBounds();

    return {
      width: boundaries?.width,
      height: boundaries?.height,
    }
  }
}