import { SimpleWindow } from './SimpleWindow';
import { Button } from './Button';
import { Label } from './Label';

import type { ElementOptions } from './Element';

type NotificationWindowOptions = ElementOptions & {
  button_text: string,
  text: string,
  on_confirm: () => void,
}

export class NotificationWindow extends SimpleWindow {
  constructor(canvas: HTMLCanvasElement, options: NotificationWindowOptions) {
    super(
      {
        ...options,
        background: 'green'
      },
      [
        new Label(
          canvas,
          {
            auto_position: {
              horizontal: 'center',
              vertical: 'top'
            },
            size: { width: options.size.width },
            text: options.text,
            align_vertical: 'top',
            align_horizontal: 'left',
          }
        ),
        new Button(
          canvas,
          {
            auto_position: {
              horizontal: 'center',
              vertical: 'top',
            },
            size: {width: options.size.width - 20, height: 30},
            text: options.button_text,
            on_click: options.on_confirm
          }
        )
      ]
    );
  }
}