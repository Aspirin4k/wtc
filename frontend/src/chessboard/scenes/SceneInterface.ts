import { RenderingContext } from '../helpers/RenderingContext';
import { ExactPosition } from '../ui/Interfaces';
import { LoadingState } from './loading/LoadingState';

export interface ControllerInterface {
    handleClick: (position: ExactPosition) => void,
    handleKeyDown: (key: string) => void,
}

export interface RendererInterface {
    renderGameFrame: (rendering_context: RenderingContext, canvas: HTMLCanvasElement) => void,
}

export interface ResourceLoaderInterface {
    getAssetsCount: () => Promise<number>,
    load: (loading_state: LoadingState) => Promise<void>,
}

export interface SceneInterface {
    renderer: RendererInterface,
    controller: ControllerInterface,
    loader: ResourceLoaderInterface,
}