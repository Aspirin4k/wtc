import { Renderable } from './RenderableInterface';
import { ExactPosition, Size } from './Interfaces';
import { RenderingContext } from '../helpers/RenderingContext';

type AutoPosition = {
  horizontal: 'left' | 'center',
  vertical: 'top' | 'middle'
}

export type ElementOptions = {
  position?: ExactPosition,
  auto_position?: AutoPosition,
  size?: Size,
};

export abstract class Element implements Renderable {
  protected position: ExactPosition | null = null;
  protected original_position: ExactPosition | null = null;
  protected size: Size;
  private readonly auto_position: AutoPosition | null = null;

  protected constructor(canvas: HTMLCanvasElement, options: ElementOptions) {
    if (options.position) {
      this.position = {
        ...options.position
      };
      this.original_position = {
        ...options.position
      };
    }
    if (options.auto_position) {
      this.auto_position = options.auto_position;
    }
    this.size = options.size;
  }

  protected abstract renderElement(context: RenderingContext): void;
  protected onClickElement(position: ExactPosition) {
    return false;
  };

  onClick(position: ExactPosition): boolean {
    const is_in_x = position.x > this.getPosition().x && position.x < this.getPosition().x + this.size.width;
    const is_in_y = position.y > this.getPosition().y && position.y < this.getPosition().y + this.size.height;
    if (!is_in_x || !is_in_y) {
      return false;
    }

    return this.onClickElement(position);
  }

  render(context: RenderingContext): void {
    this.renderElement(context);
  }

  getPosition(): ExactPosition {
    return this.position || {x: 0, y: 0};
  }

  getOriginalPosition(): ExactPosition {
    return this.original_position || {x: 0, y: 0};
  }

  getAutoPosition(): AutoPosition {
    return this.auto_position;
  }

  getSize(): Size {
    return this.size;
  }

  resetOffset(): void {
    this.position = {
      ...this.original_position
    }
  }

  setOffset(position: ExactPosition): void {
    if (!this.position) {
      this.position = {x: 0, y: 0};
    }

    this.position = {
      x: this.position.x + position.x,
      y: this.position.y + position.y,
    }
  }

  isExactPosition(): boolean {
    return null === this.auto_position;
  }

  protected background(context: RenderingContext, color: string): void {
    context.rectangle(this.getPosition(), this.size, color);
  }
}