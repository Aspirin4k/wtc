import { Stage } from 'createjs-module';

import { Container  } from "../../ui/Container";
import { SceneInterface } from "../SceneInterface";
import { NotificationWindow } from '../../ui/NotificationWindow';
import { SceneManager } from '../SceneManager';
import { Label } from '../../ui/Label';

export class Scene implements SceneInterface {
    private args: any;

    public tick(time: number): void {
    }

    public preInitialize(args: any): void {
        this.args = args;
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
                background: 'black',
                on_click: () => scene_manager.nextScene(this.args),
            },
            [
                new Label({
                    text: '\n\n\n\n\n\nThis fan game is an unofficial creation and is not endorsed, sponsored, or affiliated with 07th Expansion.' 
                    + ' All original characters, settings, and intellectual properties belong to their respective owners.\n\n'
                    + 'I strongly recommend playing original Umineko When They Cry to fully appreciate the universe' 
                    + ' and the effort put in by its original creators.\n\n'
                    + 'By continuing, you fully agree to the terms stated in this disclaimer...',
                    color: 'white',
                    align_horizontal: 'center',
                    align_vertical: 'middle',
                    position: {
                        x: (stage.canvas as HTMLCanvasElement).width / 2,
                    },
                    size: {
                        width: (stage.canvas as HTMLCanvasElement).width - 60,
                    }
                })
            ]
        );

        background.addToStage(stage);
    }

    handleKeyDown(key: string): void {
    }
}