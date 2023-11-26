import { Container as CreateJSContainer, DisplayObject } from 'createjs-module';

import { ExactPosition, Size } from './Interfaces';

export type ElementOptions = {
  position?: ExactPosition,
  size?: Size,
  transparency?: number,
};

export abstract class Element {
  protected renderObject: DisplayObject;

  protected position: ExactPosition | null = null;
  protected size: Size;
  protected transparency: number | null = null;

  protected constructor(options: ElementOptions) {
    if (options.position) {
      this.position = {
        ...options.position
      };
    }
    this.size = options.size;
    this.transparency = options.transparency || null;
  }

  protected initCommon(): void {
    if (this.transparency !== null) {
      this.renderObject.alpha = this.transparency
    }
  }

  public addToStage(stage: CreateJSContainer, position: ExactPosition = null): void
  {
    position = position || this.position || {x: 0, y: 0};
    this.renderObject.x = position.x;
    this.renderObject.y = position.y;

    stage.addChild(this.renderObject);
  }

  public hasPosition(): boolean {
    return !!this.position;
  }

  public getPosition(): ExactPosition {
    return this.position || {x: 0, y: 0};
  }

  public getSize(): Size {
    const boundaries = this.renderObject.getBounds();

    return {
      width: boundaries?.width,
      height: boundaries?.height,
    }
  }

  public getCreateJSObject(): DisplayObject {
    return this.renderObject;
  }
}