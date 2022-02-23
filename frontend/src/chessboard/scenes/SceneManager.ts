import {SceneInterface} from "./SceneInterface";
import {AssetManager} from "../helpers/AssetManager";
import {AssetResolver} from "../helpers/AssetResolver";
import {createInstance as createDisclaimer} from "./disclaimer/FactoryMethod";
import {createInstance as createNovel} from "./novel/FactoryMethod";

export const SCENE_DISCLAIMER = 'disclaimer';
export const SCENE_NOVEL = 'novel';

const CHESSBOARD_MODE_CLASSIC = 1;

export class SceneManager {
    private readonly FIRST_SCENE = SCENE_DISCLAIMER;
    private readonly SCENE_FACTORY_MAP = {
        [SCENE_NOVEL]: () => createNovel(this.asset_manager, this.asset_resolver),
        [SCENE_DISCLAIMER]: () => createDisclaimer(this),
    };
    // TODO: подумоть как конфигурировать флоу
    private readonly SCENE_FLOW = {
        [SCENE_DISCLAIMER]: SCENE_NOVEL,
    }

    private asset_manager: AssetManager;
    private asset_resolver: AssetResolver;

    private current_scene: SceneInterface = null;
    private current_scene_id: string = null;
    private scenes: {[scene_id: string]: SceneInterface} = {};

    constructor() {
        this.asset_resolver = new AssetResolver(CHESSBOARD_MODE_CLASSIC);
        this.asset_manager = new AssetManager();
    }

    public initiate(): void {
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
        scene.loader.load().then(() => {
            this.current_scene = scene;
            this.current_scene_id = scene_id;
        })
    }

    private getScene(scene_id: string): SceneInterface {
        if (!this.scenes[scene_id]) {
            this.scenes[scene_id] = this.SCENE_FACTORY_MAP[scene_id]();
        }

        return this.scenes[scene_id];
    }
}