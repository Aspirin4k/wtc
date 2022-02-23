import {ControllerInterface} from "../SceneInterface";
import {SceneManager} from "../SceneManager";

export class Controller implements ControllerInterface {
    private scene_manager: SceneManager;

    constructor(scene_manager: SceneManager) {
        this.scene_manager = scene_manager;
    }

    public handleClick(): void {
        this.scene_manager.nextScene();
    }

    public handleKeyDown(key: string): void {
    }
}
