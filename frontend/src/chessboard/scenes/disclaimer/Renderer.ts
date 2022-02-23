import {RendererInterface} from "../SceneInterface";

export class Renderer implements RendererInterface {
    public renderGameFrame(canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}
