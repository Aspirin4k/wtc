import { Stage } from 'createjs-module';

import { Container  } from "../../ui/Container";
import { SceneInterface } from "../SceneInterface";
import { NotificationWindow } from '../../ui/NotificationWindow';
import { SceneManager } from '../SceneManager';

export class Scene implements SceneInterface {
    public tick(): void {
    }

    public preInitialize(args: any): void {
    }

    public async getAssetsCount(): Promise<number> {
        return 0;
    }

    public async load(): Promise<void> {
    }

    public initialize(scene_manager: SceneManager, stage: Stage): void {
        const background = new Container(
            {
                position: {x: 0, y: 0},
                size: {
                    width: (stage.canvas as HTMLCanvasElement).width,
                    height: (stage.canvas as HTMLCanvasElement).height
                },
                alignChildren: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                background: 'black'
            },
            [
                new NotificationWindow(
                    {
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

        background.addToStage(stage);
    }

    handleKeyDown(key: string): void {
    }
}