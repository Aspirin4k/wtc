import {Controller} from "./Controller";
import {Renderer} from "./Renderer";
import {ResourceLoader} from "./ResourceLoader";
import {SceneInterface} from "../SceneInterface";
import {SceneManager} from "../SceneManager";
import { Container } from '../../ui/Container';
import { NotificationWindow } from '../../ui/NotificationWindow';

export const createInstance = (scene_manager: SceneManager, canvas: HTMLCanvasElement): SceneInterface => {
    const ui_stack = new Container(
      {
        position: {
          x: 0,
          y: 0
        },
        size: {
          width: canvas.width,
          height: canvas.height
        },
        background: 'black'
      },
      [
        new NotificationWindow(
          canvas,
          {
            auto_position: {
              horizontal: 'center',
              vertical: 'middle'
            },
            size: {width: 400},
            text: 'Приложение является чисто фанатским и ни на какие авторские права не претендует.\n\n' +
              'Рекомендую ознакомиться с оригинальным произведением, чтобы получить полный опыт.',
            button_text: 'Понимаю',
            on_confirm: () => {
              scene_manager.nextScene()
            }
          }
        )
      ]
    );

    const controller = new Controller(scene_manager, ui_stack);
    const renderer = new Renderer(ui_stack);
    const loader = new ResourceLoader();

    return {
        controller,
        loader,
        renderer,
    }
}
