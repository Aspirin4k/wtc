import {LoggerFactory} from "../../logger/LoggerFactory";
import {SceneManager} from "./SceneManager";
import { RenderingContext } from '../helpers/RenderingContext';

const FPS_50 = 1000 / 50;

export class SceneRenderer {
    private scene_manager: SceneManager;

    private canvas: HTMLCanvasElement;
    private rendering_context: RenderingContext;
    private game_render_loop;

    public constructor(scene_manager: SceneManager) {
        this.scene_manager = scene_manager;
    }

    public register(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.rendering_context = new RenderingContext(this.canvas);
        this.game_render_loop = setInterval(this.tryRenderGameFrame.bind(this), FPS_50);
    }

    public unregister() {
        clearInterval(this.game_render_loop);
    }

    tryRenderGameFrame() {
        try {
            const scene = this.scene_manager.getCurrentScene();
            if (scene) {
                scene.renderer.renderGameFrame(this.rendering_context, this.canvas);
            }
        } catch (e) {
            clearInterval(this.game_render_loop);
            LoggerFactory.getLogger().error('Render exception', {error: e});
        }
    }
}
