import { RenderingContext } from '../helpers/RenderingContext';
import { ExactPosition } from '../ui/Interfaces';

export interface ControllerInterface {
    handleClick: (position: ExactPosition) => void,
    handleKeyDown: (key: string) => void,
}

export interface RendererInterface {
    renderGameFrame: (rendering_context: RenderingContext, canvas: HTMLCanvasElement) => void,
}

export interface ResourceLoaderInterface {
    load: () => Promise<void>,
}

export interface SceneInterface {
    renderer: RendererInterface,
    controller: ControllerInterface,
    loader: ResourceLoaderInterface,
}