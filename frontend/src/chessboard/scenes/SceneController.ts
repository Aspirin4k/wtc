import {SceneManager} from "./SceneManager";
import { ExactPosition } from '../ui/Interfaces';

export class SceneController {
    private scene_manager: SceneManager;
    private canvas: HTMLCanvasElement;

    public constructor(scene_manager: SceneManager) {
        this.scene_manager = scene_manager;

        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    public register(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        canvas.addEventListener('click', this.handleClick);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    public unregister(canvas: HTMLCanvasElement) {
        this.canvas = null;
        canvas.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    private handleClick(event: MouseEvent) {
        const scene = this.scene_manager.getCurrentScene();
        if (scene) {
            scene.controller.handleClick(this.getCursorPointerPosition(event));
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        const scene = this.scene_manager.getCurrentScene();
        if (scene) {
            scene.controller.handleKeyDown(event.key);
        }
    }

    private getCursorPointerPosition(event: MouseEvent): ExactPosition {
        if (!this.canvas) {
            return {x: 0, y: 0}
        }

        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        }
    }
}
