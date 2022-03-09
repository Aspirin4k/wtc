import {RendererInterface} from "../SceneInterface";
import { RenderingContext } from '../../helpers/RenderingContext';
import { UIStack } from '../../helpers/UIStack';

export class Renderer implements RendererInterface {
    private ui_stack: UIStack;

    constructor(ui_stack: UIStack) {
        this.ui_stack = ui_stack;
    }

    public renderGameFrame(rendering_context: RenderingContext, canvas: HTMLCanvasElement): void {
        rendering_context.rectangle({x: 0, y: 0}, {width: canvas.width, height: canvas.height}, 'black');
        this.ui_stack.render(rendering_context);
    }
}
