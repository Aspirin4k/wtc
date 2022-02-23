import {SceneManager} from "./SceneManager";

export class SceneController {
    private scene_manager: SceneManager;

    public constructor(scene_manager: SceneManager) {
        this.scene_manager = scene_manager;

        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    public register(canvas: HTMLCanvasElement) {
        canvas.addEventListener('click', this.handleClick);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    public unregister(canvas: HTMLCanvasElement) {
        canvas.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    private handleClick() {
        const scene = this.scene_manager.getCurrentScene();
        if (scene) {
            scene.controller.handleClick();
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        const scene = this.scene_manager.getCurrentScene();
        if (scene) {
            scene.controller.handleKeyDown(event.key);
        }
    }
}
