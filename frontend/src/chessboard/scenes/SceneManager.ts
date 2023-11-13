import {SceneInterface} from "./SceneInterface";
import {AssetManager} from "../helpers/AssetManager";
import {AssetResolver} from "../helpers/AssetResolver";
import {createInstance as createDisclaimer} from "./disclaimer/FactoryMethod";
import {createInstance as createNovel} from "./novel/FactoryMethod";
import { createInstance as createLoading} from "./loading/FactoryMethod";
import { Renderer as LoadingRenderer } from "./loading/Renderer";

export const SCENE_DISCLAIMER = 'disclaimer';
export const SCENE_NOVEL = 'novel';
export const SCENE_LOADING = 'loading';

const CHESSBOARD_MODE_CLASSIC = 1;

export class SceneManager {
    private readonly FIRST_SCENE = SCENE_DISCLAIMER;
    private readonly SCENE_FACTORY_MAP = {
        [SCENE_NOVEL]: () => createNovel(this.asset_manager, this.asset_resolver),
        [SCENE_DISCLAIMER]: () => createDisclaimer(this, this.canvas),
        [SCENE_LOADING]: () => createLoading(this.canvas),
    };
    // TODO: подумоть как конфигурировать флоу
    private readonly SCENE_FLOW = {
        [SCENE_DISCLAIMER]: SCENE_NOVEL,
    }

    private readonly asset_manager: AssetManager;
    private readonly asset_resolver: AssetResolver;
    private canvas: HTMLCanvasElement;

    private current_scene: SceneInterface = null;
    private current_scene_id: string = null;
    private scenes: {[scene_id: string]: SceneInterface} = {};

    constructor() {
        this.asset_resolver = new AssetResolver(CHESSBOARD_MODE_CLASSIC);
        this.asset_manager = new AssetManager();
    }

    public initiate(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.changeScene(this.FIRST_SCENE);
    }

    public nextScene(): void {
        this.changeScene(this.SCENE_FLOW[this.current_scene_id]);
    }

    public getCurrentScene(): SceneInterface {
        return this.current_scene;
    }

    private changeScene(scene_id: string): void {
        const scene = this.getScene(scene_id);

        scene.loader
            .getAssetsCount()
            .then((resourcesCount) => {
                if (0 === resourcesCount) {
                    this.current_scene = scene;
                    this.current_scene_id = scene_id;
                    return;
                }

                this.current_scene = this.getScene(SCENE_LOADING);
                const loading_renderer = this.current_scene.renderer as LoadingRenderer;
                const state = loading_renderer.getLoadingState(resourcesCount);
                scene.loader.load(state).then(() => {
                    this.current_scene = scene;
                    this.current_scene_id = scene_id;
                })
            })
    }

    private getScene(scene_id: string): SceneInterface {
        if (!this.scenes[scene_id]) {
            this.scenes[scene_id] = this.SCENE_FACTORY_MAP[scene_id]();
        }

        return this.scenes[scene_id];
    }
}