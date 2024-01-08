import { Stage, Ticker, TickerEvent } from 'createjs-module';

import {SceneInterface} from "./SceneInterface";
import {AssetManager} from "../helpers/AssetManager";
import {AssetResolver} from "../helpers/AssetResolver";
import {Scene as DisclaimerScene} from "./disclaimer/Scene";
import { Scene as NovelScene } from './novel/Scene';
import { Scene as LoadingScene } from './loading/Scene';
import { Scene as PurpleGameScene } from './purple-game/Scene';
import { AssetLoader } from "../helpers/AssetLoader";
import { LoggerFactory } from '../../logger/LoggerFactory';
import { BGM } from './novel/BGM';
import { removeAllEventListeners } from '../helpers/CreateJS';

export const SCENE_DISCLAIMER = 'disclaimer';
export const SCENE_NOVEL = 'novel';
export const SCENE_LOADING = 'loading';
export const SCENE_PURPLE_GAME = 'purple-game';

const CHESSBOARD_MODE_CLASSIC = 1;

const FPS = 50;

export class SceneManager {
    private readonly FIRST_SCENE = SCENE_DISCLAIMER;
    private readonly SCENE_FACTORY_MAP = {
        [SCENE_NOVEL]: () => new NovelScene(this.asset_manager, this.asset_loader, this.bgm),
        [SCENE_DISCLAIMER]: () => new DisclaimerScene(),
        [SCENE_LOADING]: () => new LoadingScene(),
        [SCENE_PURPLE_GAME]: () => new PurpleGameScene(this.asset_loader, this.asset_manager, this.bgm),
    };
    // TODO: подумоть как конфигурировать флоу
    private readonly SCENE_FLOW = {
        [SCENE_DISCLAIMER]: SCENE_PURPLE_GAME,
        [SCENE_NOVEL]: SCENE_PURPLE_GAME,
    }

    private readonly asset_manager: AssetManager;
    private readonly asset_resolver: AssetResolver;
    private readonly asset_loader: AssetLoader;
    private readonly bgm: BGM;
    private stage: Stage;

    private current_scene: SceneInterface = null;
    private current_scene_id: string = null;
    private is_changing_scene: boolean = false;
    private scenes: {[scene_id: string]: SceneInterface} = {};

    constructor() {
        this.asset_resolver = new AssetResolver(CHESSBOARD_MODE_CLASSIC);
        this.asset_manager = new AssetManager();
        this.asset_loader = new AssetLoader(this.asset_manager, this.asset_resolver);
        this.bgm = new BGM();

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.tick = this.tick.bind(this)
    }

    public register(stage: Stage): void {
        Ticker.framerate = FPS;
        Ticker.addEventListener('tick', this.tick);

        document.addEventListener('keydown', this.handleKeyDown);

        this.stage = stage;
        this.changeScene(this.FIRST_SCENE);
    }

    public unregister() {
        document.removeEventListener('keydown', this.handleKeyDown);
        Ticker.removeEventListener('tick', this.tick);
    }

    public nextScene(): void {
        this.changeScene(this.SCENE_FLOW[this.current_scene_id]);
    }

    public getCurrentScene(): SceneInterface {
        return this.current_scene;
    }

    tick(event: TickerEvent) {
        try {
            const scene = this.getCurrentScene();
            if (scene) {
                scene.tick(event.time);
            }

            this.stage.update(event);
        } catch (e) {
            Ticker.removeEventListener('tick', this.tick);
            LoggerFactory.getLogger().error('Render exception', {error: e});
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        const scene = this.getCurrentScene();
        if (scene) {
            scene.handleKeyDown(event.key);
        }
    }

    public changeScene(scene_id: string, args: any = null): void {
        if (this.is_changing_scene) {
            return;
        }

        this.is_changing_scene = true;
        this.bgm.stop();

        const loadingScene = (this.getScene(SCENE_LOADING) as LoadingScene);
        this.renderScene(loadingScene, SCENE_LOADING);

        this.asset_manager.freeResources();

        const scene = this.getScene(scene_id);
        if (args) {
            scene.preInitialize(args);
        }
    

        scene
            .getAssetsCount()
            .then((maximum) => {
                if (0 === maximum) {
                    this.renderScene(scene, scene_id);
                    this.is_changing_scene = false;
                    return;
                }

                const loadingState = loadingScene.getLoadingState(maximum);
                scene.load(loadingState).then(() => {
                    this.renderScene(scene, scene_id);
                    this.is_changing_scene = false;
                });
            });
    }

    private renderScene(scene: SceneInterface, scene_id: string): void {
        removeAllEventListeners(this.stage);
        this.stage.removeAllChildren();

        scene.initialize(this, this.stage);

        this.current_scene = scene;
        this.current_scene_id = scene_id;
    }

    private getScene(scene_id: string): SceneInterface {
        if (!this.scenes[scene_id]) {
            this.scenes[scene_id] = this.SCENE_FACTORY_MAP[scene_id]();
        }

        return this.scenes[scene_id];
    }
}