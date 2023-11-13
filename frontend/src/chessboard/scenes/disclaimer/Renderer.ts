import {RendererInterface} from "../SceneInterface";
import { RenderingContext } from '../../helpers/RenderingContext';
import { Container } from "../../ui/Container";

export class Renderer implements RendererInterface {
    private ui_stack: Container;

    constructor(ui_stack: Container) {
        this.ui_stack = ui_stack;
    }

    public renderGameFrame(rendering_context: RenderingContext, canvas: HTMLCanvasElement): void {
        this.ui_stack.render(rendering_context);
    }
}
