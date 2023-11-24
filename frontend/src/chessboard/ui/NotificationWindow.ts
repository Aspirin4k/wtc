import { Container } from './Container';
import { Button } from './Button';
import { Label } from './Label';

import type { ElementOptions } from './Element';

type NotificationWindowOptions = ElementOptions & {
  button_text: string,
  text: string,
  on_confirm: () => void,
}

export class NotificationWindow extends Container {
  constructor( options: NotificationWindowOptions) {
    super(
      {
        ...options,
        alignChildren: {
          horizontal: 'center',
          vertical: 'top'
        },
        background: 'green',
        padding: 10
      },
      [
        new Label(
          {
            size: { width: options.size?.width },
            text: options.text,
            align_vertical: 'top',
            align_horizontal: 'left',
          }
        ),
        new Button(
          {
            alignChildren: {
              horizontal: 'center',
              vertical: 'middle',
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