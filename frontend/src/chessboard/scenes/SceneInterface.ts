export interface ControllerInterface {
    handleClick: () => void,
    handleKeyDown: (key: string) => void,
}

export interface RendererInterface {
    renderGameFrame: (canvas: HTMLCanvasElement) => void,
}

export interface ResourceLoaderInterface {
    load: () => Promise<void>,
}

export interface SceneInterface {
    renderer: RendererInterface,
    controller: ControllerInterface,
    loader: ResourceLoaderInterface,
}