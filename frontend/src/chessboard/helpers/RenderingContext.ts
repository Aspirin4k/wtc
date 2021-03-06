import { ExactPosition, Size } from '../ui/Interfaces';
import { TEXT_FONT_FAMILY, TEXT_FONT_SIZE } from '../scenes/novel/text/Constants';

export class RenderingContext {
  canvas: HTMLCanvasElement;
  canvas_context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas_context = canvas.getContext('2d');
  }

  rectangle(position: ExactPosition, size: Size, color: string): void {
    this.canvas_context.fillStyle = color;
    this.canvas_context.fillRect(
      position.x,
      position.y,
      size ? size.width : this.canvas.width,
      size ? size.height : this.canvas.height
    );
  }

  text(position: ExactPosition, text: string, color: string, font_size: number): void {
    this.canvas_context.font = `${font_size}px ${TEXT_FONT_FAMILY}`;
    this.canvas_context.fillStyle = color;
    this.canvas_context.fillText(
      text,
      position.x,
      position.y,
    )
  }
}
