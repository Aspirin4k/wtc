import { DisplayObject } from "createjs-module";
import { AssetManager } from "../../helpers/AssetManager";
import { SCENE_NOVEL, SceneManager } from "../SceneManager";

import { LeftMenu } from "./screens/left-menu/LeftMenu";
import { CulpritSelect } from "./screens/culprit-select/CulpritSelect";
import { BGM } from "../novel/BGM";
import { Game } from "./Scene";
import { Effect } from "../novel/ScreenStateInterface";

export interface Renderable {
    render(): DisplayObject[]
}

export class InterfaceState {
    private currentState: DisplayObject[] = [];

    private readonly asset_manager: AssetManager;
    private readonly scene_manager: SceneManager;
    private readonly bgm: BGM;
    
    private readonly game: Game;

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    private readonly toggleMouse: (enabled: boolean) => void;

    private currentRenderable;

    constructor(
        asset_manager: AssetManager, 
        sceneManager: SceneManager, 
        bgm: BGM, 
        game: Game, 
        screenWidth: number,
        screenHeight: number,
        toggleMouse: (enabled: boolean) => void,
    ) {
        this.asset_manager = asset_manager;
        this.scene_manager = sceneManager;
        this.bgm = bgm;

        this.game = game;

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        this.toggleMouse = toggleMouse;

        this.renderLeftMenu();
    }

    private renderLeftMenu() {
        this.currentRenderable = new LeftMenu(
            this.asset_manager,
            this.bgm,
            this.game,
            {width: this.screenWidth, height: this.screenHeight},
            this.game.twilights.map((twilight) => {
                return {
                    name: twilight.name,
                    on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight)
                }
            }),
            () => this.renderCulpritSelect(),
            this.render.bind(this),
            this.toggleMouse,
            this.game.twilights
        );
    }

    private renderCulpritSelect() {
        this.currentRenderable = new CulpritSelect(
            this.asset_manager,
            this.bgm,
            this.game,
            {width: this.screenWidth, height: this.screenHeight},
            () => this.renderLeftMenu(),
            this.render.bind(this),
            this.toggleMouse
        )
    }

    public getCurrentState(): DisplayObject[] {
        return this.currentState;
    }

    private render(objects: DisplayObject[]) {
        this.currentState.splice(0, this.currentState.length);
        objects.forEach((object) => this.currentState.push(object));
    }
};