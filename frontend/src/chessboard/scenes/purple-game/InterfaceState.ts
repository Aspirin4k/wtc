import { DisplayObject } from "createjs-module";
import { AssetManager } from "../../helpers/AssetManager";
import { SCENE_NOVEL, SceneManager } from "../SceneManager";

import twilight1 from "../../classic/twilight/1_twilight.json";
import twilight2 from "../../classic/twilight/2_twilight.json";
import twilight4 from "../../classic/twilight/4_twilight.json";
import twilight56 from "../../classic/twilight/5-6_twilight.json";
import twilight7 from "../../classic/twilight/7_twilight.json";
import twilight8 from "../../classic/twilight/8_twilight.json";
import { LeftMenu } from "./screens/left-menu/LeftMenu";
import { CulpritSelect } from "./screens/culprit-select/CulpritSelect";

export interface Renderable {
    render(): DisplayObject[]
}

export class InterfaceState {
    private currentState: DisplayObject[] = [];

    private readonly asset_manager: AssetManager;
    private readonly scene_manager: SceneManager;

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    private currentRenderable;

    constructor(asset_manager: AssetManager, sceneManager: SceneManager, screenWidth: number, screenHeight: number) {
        this.asset_manager = asset_manager;
        this.scene_manager = sceneManager;

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;


        this.renderLeftMenu();
    }

    private renderLeftMenu() {
        this.currentRenderable = new LeftMenu(
            this.asset_manager,
            {width: this.screenWidth, height: this.screenHeight},
            [
                {
                    name: 'The First Twilight',
                    on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight1),
                },
                {
                    name: 'The Second Twilight',
                    on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight2),
                },
                {
                    name: 'The Fourth Twilight',
                    on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight4),
                },
                {
                    name: 'The Fifth/Sixth Twilight',
                    on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight56),
                },
                {
                    name: 'The Seventh Twilight',
                    on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight7),
                },
                {
                    name: 'The Eighth Twilight',
                    on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight56),
                },
            ],
            () => this.renderCulpritSelect(),
            this.render.bind(this),
            [twilight1, twilight2, twilight4, twilight56, twilight7, twilight8]
        );
    }

    private renderCulpritSelect() {
        this.currentRenderable = new CulpritSelect(
            this.asset_manager,
            {width: this.screenWidth, height: this.screenHeight},
            () => this.renderLeftMenu(),
            this.render.bind(this)
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