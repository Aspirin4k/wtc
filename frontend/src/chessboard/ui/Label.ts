import { Text, Container as CreateJSContainer } from 'createjs-module';

import { Element } from './Element';
import { RenderingContext } from '../helpers/RenderingContext';
import { calculateRows, TextTokenInterface } from '../helpers/StringRowsCalculator';

import type { ElementOptions } from './Element';
import { ExactPosition } from './Interfaces';

type LabelOptions = ElementOptions & {
  text: string,
  align_horizontal?: 'center' | 'left',
  align_vertical?: 'middle' | 'top',
}

export class Label extends Element {
  protected renderObject: Text;
  private readonly font_size = 20;
  private readonly options: LabelOptions;

  private tokens: TextTokenInterface[] = [];
  private line_height: number;

  constructor(options: LabelOptions) {
    super(options)
    
    this.renderObject = new Text(
      options.text,
      '20px Arial'
    );
    this.renderObject.name = 'Label';
  }

  public addToStage(stage: CreateJSContainer, position: ExactPosition = {x: 0, y: 0}): void {
    if (!this.options?.size?.width) {
      this.renderObject.lineWidth = stage.getBounds()?.width;
    }

    super.addToStage(stage, position);
  }

  // protected renderElement(context: RenderingContext): void {
  //   this.tokens.forEach((token) => {
  //     context.text({
  //       x: this.getPosition().x + token.offset.x,
  //       y: this.getPosition().y + token.offset.y
  //     }, token.text, token.color, this.font_size)
  //   })
  // }

  // private init(context: CanvasRenderingContext2D): void {
  //   this.line_height = context.measureText('M').width;
  //   this.tokens = calculateRows(
  //     context,
  //     {
  //       text: this.options.text,
  //       color: {
  //         default: 'white'
  //       },
  //       size: {
  //         width: this.size.width - 20,
  //         font: this.font_size
  //       }
  //     }
  //   )

  //   let max_width = 0;
  //   const rows_widths = this.tokens.reduce((result, token) => {
  //     if (!result[token.line_num]) {
  //       result[token.line_num] = token.width;
  //     } else {
  //       result[token.line_num] += token.width;
  //     }

  //     if (result[token.line_num] > max_width) {
  //       max_width = result[token.line_num];
  //     }

  //     return result;
  //   }, {})

  //   // TODO: хз как это работает, оч сложно
  //   const text_height = this.font_size * Object.keys(rows_widths).length
  //    + Object.keys(rows_widths).length * this.line_height / 2;

  //   this.size = {
  //     width: max_width,
  //     height: text_height,
  //   }
  //   this.initAlignment(rows_widths, text_height);
  // }

  // private initAlignment(rows_widths: {[line_num: string]: number}, text_height: number): void {
  //   this.tokens.forEach((token) => {
  //     switch (this.options.align_horizontal) {
  //       case 'left':
  //         break;
  //       case 'center':
  //       default:
  //         token.offset.x = (this.size.width - rows_widths[token.line_num]) / 2 + token.offset.x;
  //         break;
  //     }

  //     switch (this.options.align_vertical) {
  //       case 'top':
  //         token.offset.y = this.font_size + token.offset.y;
  //         break;
  //       case 'middle':
  //       default:
  //         token.offset.y = this.font_size + (this.size.height - text_height) / 2 + token.offset.y;
  //         break;
  //     }
  //   })
  // }
}