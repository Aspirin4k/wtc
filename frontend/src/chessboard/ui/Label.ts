import { Element } from './Element';
import { RenderingContext } from '../helpers/RenderingContext';
import { calculateRows, TextTokenInterface } from '../helpers/StringRowsCalculator';

import type { ElementOptions } from './Element';

type LabelOptions = ElementOptions & {
  text: string,
  align_horizontal?: 'center' | 'left',
  align_vertical?: 'middle' | 'top',
}

export class Label extends Element {
  private font_size = 20;
  private readonly options: LabelOptions;

  private tokens: TextTokenInterface[] = [];

  constructor(canvas: HTMLCanvasElement, options: LabelOptions) {
    super(canvas, options)
    this.options = options;
    this.init(canvas.getContext('2d'));
  }

  protected renderElement(context: RenderingContext): void {
    this.tokens.forEach((token) => {
      context.text({
        x: this.getPosition().x + token.offset.x,
        y: this.getPosition().y + token.offset.y
      }, token.text, token.color, this.font_size)
    })
  }

  private init(context: CanvasRenderingContext2D): void {
    this.tokens = calculateRows(
      context,
      {
        text: this.options.text,
        color: {
          default: 'yellow'
        },
        size: {
          width: this.size.width - 20,
          font: this.font_size,
          line_height: 24
        }
      }
    )

    let max_width = 0;
    const rows_widths = this.tokens.reduce((result, token) => {
      if (!result[token.line_num]) {
        result[token.line_num] = token.width;
      } else {
        result[token.line_num] += token.width;
      }

      if (result[token.line_num] > max_width) {
        max_width = result[token.line_num];
      }

      return result;
    }, {})

    const text_height = this.font_size * Object.keys(rows_widths).length;
    this.size = {
      width: max_width,
      height: text_height,
    }
    this.initAlignment(rows_widths, text_height);
  }

  private initAlignment(rows_widths: {[line_num: string]: number}, text_height: number): void {
    this.tokens.forEach((token) => {
      switch (this.options.align_horizontal) {
        case 'left':
          token.offset.x += 10;
          break;
        case 'center':
        default:
          token.offset.x = (this.size.width - rows_widths[token.line_num]) / 2 + token.offset.x;
          break;
      }

      switch (this.options.align_vertical) {
        case 'top':
          token.offset.y = this.font_size + 6 + token.offset.y;
          break;
        case 'middle':
        default:
          token.offset.y = 1.3 * this.font_size + (this.size.height - text_height) / 2 + token.offset.y;
          break;
      }
    })
  }
}