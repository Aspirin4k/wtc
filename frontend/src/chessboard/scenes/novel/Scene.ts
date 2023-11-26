import { Bitmap, Stage, Text, Shadow, ColorMatrix, ColorMatrixFilter, Filter } from "createjs-module";

import { SceneInterface } from "../SceneInterface";
import { SceneManager } from "../SceneManager";
import { AssetManager } from "../../helpers/AssetManager";
import { State } from "./State";
import { AssetLoader } from "../../helpers/AssetLoader";
import { Character } from "./ScreenStateInterface";
import { TEXT_FONT_FAMILY, TEXT_FONT_SIZE, TEXT_LINE_HEIGHT, TEXT_X_OFFSET, TEXT_Y_OFFSET } from "./text/Constants";
import { RenderTokenCalculator } from "./text/RenderTokenCalculator";
import { LoadingStateInteface } from "../loading/Scene";
import { getBitmap } from "../../helpers/Image";

const KEY_ARROW_RIGHT = 'ArrowRight';
const KEY_ARROW_LEFT = 'ArrowLeft';
const KEY_ENTER = 'Enter';

const EFFECT_GRAYSCALE = 'grayscale';
const EFFECT_RAIN = 'rain';

export const CLASSIC_SCREEN_WIDTH = 640;
export const CLASSIC_SCREEN_HEIGHT = 480;

export class Scene implements SceneInterface {
    private readonly asset_manager: AssetManager;
    private readonly asset_loader: AssetLoader;

    private game_state: State;
    private twilight: any;
    private readonly text_render_calculator: RenderTokenCalculator;

    private stage: Stage;
    private scene_manager: SceneManager;

    constructor(asset_manager: AssetManager, asset_loader: AssetLoader) {
        this.asset_manager = asset_manager;
        this.asset_loader = asset_loader;

        this.text_render_calculator = new RenderTokenCalculator();

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    public preInitialize(args: any): void {
        this.twilight = args;
        this.game_state = new State(this.asset_manager, this.twilight);
    }

    public tick(): void {
    }

    public async getAssetsCount(): Promise<number> {
        return Object.keys(this.twilight.resources.audio).length
            + Object.keys(this.twilight.resources.images).length;
    }

    public async load(loadingState: LoadingStateInteface): Promise<void> {
        await this.asset_loader.createLoaderPromise(
            this.twilight.resources.images,
            this.twilight.resources.audio,
            {},
            loadingState
        );
    }

    public initialize(scene_manager: SceneManager, stage: Stage): void {
        this.stage = stage;
        this.scene_manager = scene_manager;

        stage.on('click', () => {
            this.proceedNovel();
            this.renderState();
        })

        this.renderState();
    }

    handleKeyDown(key: string): void {
        switch (key) {
            case KEY_ENTER:
            case KEY_ARROW_RIGHT:
                this.proceedNovel();
                this.renderState();
                break;
            case KEY_ARROW_LEFT:
                this.game_state.revertNovel();
                this.renderState();
                break;
        }
    }

    private proceedNovel(): void {
        if (!this.game_state.proceedNovel()) {
            this.scene_manager.nextScene();
        }
    }

    private renderState(): void {
        const {game_state, stage} = this;
        const screen_state = game_state.getCurrentScene();
        const {background, text} = screen_state;

        const screenWidth = (this.stage.canvas as HTMLCanvasElement).width;
        const screenHeight = (this.stage.canvas as HTMLCanvasElement).height;

        this.stage.removeAllChildren();

        const filters = [];
        if (!!text.content) {
            filters.push(
                new ColorMatrixFilter(
                    (new ColorMatrix)
                        .adjustBrightness(-25)
                        .adjustContrast(-30)
                )
            );
        }

        if (background.effect.includes(EFFECT_GRAYSCALE)) {
            filters.push(
                new ColorMatrixFilter(
                    (new ColorMatrix)
                        .adjustBrightness(-25)
                        .adjustSaturation(-100)
                        .adjustContrast(-30)
                )
            );
        }

        this.renderBackground(filters);
        this.renderCharaters(filters);
        if (background.effect.includes(EFFECT_RAIN)) {
            const rain = this.getBitmap('e_rain', screenWidth, screenHeight);
            rain.compositeOperation = 'screen';
            stage.addChild(rain);
        }

        this.renderText();
    }

    private renderBackground(filters: Filter[]): void {
        const background = this.game_state.getCurrentScene().background;

        const screenWidth = (this.stage.canvas as HTMLCanvasElement).width;
        const screenHeight = (this.stage.canvas as HTMLCanvasElement).height;

        const bitmap = this.getBitmap(background.url, screenWidth, screenHeight);
        bitmap.filters = filters;
        bitmap.cache(0, 0, bitmap.getBounds().width, bitmap.getBounds().height);
        this.stage.addChild(bitmap);
    }

    private renderCharaters(filters: Filter[]): void {
        const {game_state, stage} = this;
        const screen_state = game_state.getCurrentScene();
        const {characters} = screen_state;
        const screenHeight = (stage.canvas as HTMLCanvasElement).height;

        const z_indexed: Character[][] = [[],[],[]];

        Object.keys(characters).forEach((position: string) => {
            if (!!characters[position]) {
                z_indexed[characters[position]["z-index"] - 1].push(characters[position]);
            }
        });

        z_indexed.forEach((characters_array: Character[]) => {
            characters_array.forEach((character: Character) => {
                const bitmap = this.getBitmap(character.url, character.width, screenHeight);
                bitmap.x = character.x;
                bitmap.y = 0;
                bitmap.filters = filters;
                bitmap.cache(0, 0, bitmap.getBounds().width, bitmap.getBounds().height);
                
                stage.addChild(bitmap);
            });
        });
    }

    private renderText(): void {
        const {game_state, stage} = this;
        const screen_state = game_state.getCurrentScene();
        const {text} = screen_state;

        if (!text.content) {
            return;
        }

        this.text_render_calculator
            .calculate(text.content)
            .forEach((textToken) => {
                const createjsText = new Text(
                    textToken.text,
                    `${TEXT_FONT_SIZE}px ${TEXT_FONT_FAMILY}`
                );
                createjsText.color = textToken.color;
        
                const shadow = new Shadow('#000', 1, 1, 0);
                createjsText.shadow = shadow;
        
                createjsText.x = textToken.offset_x + TEXT_X_OFFSET;
                createjsText.y = textToken.offset_y + textToken.line_num * TEXT_LINE_HEIGHT + TEXT_Y_OFFSET;
        
                stage.addChild(createjsText);
            });
    }

    private getBitmap(url: string, width: number, height: number): Bitmap {
        const {asset_manager} = this;

        const img = asset_manager.getImage(url);
        return getBitmap(img, width, height);
    }
}