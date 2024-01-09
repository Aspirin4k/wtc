import { Stage } from "createjs-module";
import { SceneInterface } from "../SceneInterface";
import { SceneManager } from "../SceneManager";
import { AssetLoader } from "../../helpers/AssetLoader";
import { LoadingStateInteface } from "../loading/Scene";
import { AssetManager } from "../../helpers/AssetManager";
import { InterfaceState } from "./InterfaceState";
import { BGM } from "../novel/BGM";
import { Effect, Proceeding, ScreenState } from "../novel/ScreenStateInterface";
import { ScreenAnimation } from "../novel/animation/ScreenAnimation";

export type Game = Resourcable & {
    twilights: Twilight[],
    characters: {[name: string]: GameCharacter},
    culprit_board: [CulpritBoardRow, CulpritBoardRow, CulpritBoardRow, CulpritBoardRow, CulpritBoardRow],
    solution: string[],
};

type Twilight = Resourcable & {
    name: string,
    deaths: string[],
    url: string,
    mode: 'classic',
    scene: ScreenState,
    proceeding: Proceeding[],
}

type Resourcable = {
    resources: {
        atlases: {[short_name: string]: string},
        images: {[short_name: string]: string},
        audio: {[short_name: string]: string},
        fonts: {[short_name: string]: string},
    }
}

export type GameCharacter = {
    relation: {
        color: string,
        sides: {
            left?: boolean,
            right?: boolean,
            top?: boolean,
            bottom?: boolean,
        }
    }
}

type CulpritBoardRow = [string | null, string | null, string | null, string | null];

export class Scene implements SceneInterface {
    private readonly asset_loader: AssetLoader;
    private readonly asset_manager: AssetManager;
    private readonly bgm: BGM;
    private readonly screen_animation: ScreenAnimation;
    
    private game: Game;
    private state: InterfaceState;

    constructor(asset_loader: AssetLoader, asset_manager: AssetManager, bgm: BGM) {
        this.asset_loader = asset_loader;
        this.asset_manager = asset_manager;
        this.bgm = bgm;

        this.screen_animation = new ScreenAnimation();
    }

    public preInitialize(args: any): void {
    }

    public tick(time: number): void {
    }

    public async getAssetsCount(): Promise<number> {
        this.game = await this.asset_manager.loadJSON('game', '/chessboard/classic/metadata/game.json');

        return Object.keys(this.game.resources.images).length 
            + Object.keys(this.game.resources.audio).length 
            + Object.keys(this.game.resources.atlases).length
            + Object.keys(this.game.resources.fonts).length;
    }

    public async load(loadingState: LoadingStateInteface): Promise<void> {
        await this.asset_loader.createLoaderPromise(
            this.game.resources.images,
            this.game.resources.atlases,
            this.game.resources.audio,
            this.game.resources.fonts,
            this.game.twilights.reduce((res, twilight) => {
                res[twilight.name] = twilight.url;
                return res;
            }, {}),
            loadingState
        );

        for (let i = 0; i < this.game.twilights.length; i++) {
            const twilightMetadata = await this.asset_manager.loadJSON(this.game.twilights[i].name, this.game.twilights[i].url);

            this.game.twilights[i] = await {
                ...this.game.twilights[i],
                ...twilightMetadata,
            }
        }
    }

    public initialize(scene_manager: SceneManager, stage: Stage): void {
        const screenWidth = (stage.canvas as HTMLCanvasElement).width;
        const screenHeight = (stage.canvas as HTMLCanvasElement).height;

        this.state = new InterfaceState(
            this.asset_manager, 
            scene_manager, 
            this.bgm, 
            this.game, 
            screenWidth, 
            screenHeight,
            (enabled: boolean) => {
                stage.mouseChildren = enabled;
            }
        );
        const bgm = this.asset_manager.getAudio('main');
        this.bgm.play(bgm);

        stage.children = this.state.getCurrentState();
    }

    handleKeyDown(key: string): void {
    }
}