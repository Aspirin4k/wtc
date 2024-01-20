import { Bitmap, Stage, ColorMatrix, Filter, Container, DisplayObject, Shape} from "createjs-module";

import { SceneInterface } from "../SceneInterface";
import { SceneManager } from "../SceneManager";
import { AssetManager } from "../../helpers/AssetManager";
import { State } from "./State";
import { AssetLoader } from "../../helpers/AssetLoader";
import { Character } from "./ScreenStateInterface";
import { RenderTokenCalculator } from "./text/RenderTokenCalculator";
import { LoadingStateInteface } from "../loading/Scene";
import { getBitmap } from "../../helpers/Image";
import { AnimatedText } from "./text/AnimatedText";
import { ScreenAnimation } from "./animation/ScreenAnimation";
import { BGM } from "./BGM";
import { Clock } from "./animation/Clock";
import { ColorMatrixFilter } from "./filter/ColorMatrixFilter"; 

const KEY_ARROW_RIGHT = 'ArrowRight';
const KEY_ARROW_LEFT = 'ArrowLeft';
const KEY_ENTER = 'Enter';

const EFFECT_GRAYSCALE = 'grayscale';
const EFFECT_RAIN = 'rain';
const EFFECT_META = 'meta';
const EFFECT_CINEMATIC = 'cinematic';

export const CLASSIC_SCREEN_WIDTH = 640;
export const CLASSIC_SCREEN_HEIGHT = 480;

export class Scene implements SceneInterface {
    private readonly ELEMENT_RAIN = 'element_rain';

    private readonly OBJECT_BACKGROUND = 'background';

    private readonly asset_manager: AssetManager;
    private readonly asset_loader: AssetLoader;
    private readonly bgm: BGM;

    private game_state: State;
    private twilight: any;
    private readonly text_render_calculator: RenderTokenCalculator;
    private readonly screen_animation: ScreenAnimation;
    private readonly clock: Clock;

    private stage: Stage;
    private scene_manager: SceneManager;
    private animated_text: AnimatedText;

    private auto_transition_timeout: NodeJS.Timeout;

    constructor(asset_manager: AssetManager, asset_loader: AssetLoader, bgm: BGM) {
        this.asset_manager = asset_manager;
        this.asset_loader = asset_loader;
        this.bgm = bgm;

        this.text_render_calculator = new RenderTokenCalculator();
        this.screen_animation = new ScreenAnimation();
        this.clock = new Clock(asset_manager);

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    public preInitialize(args: any): void {
        this.twilight = args;
        this.game_state = new State(this.asset_manager, this.twilight);
    }

    public tick(time: number): void {
        this.animated_text && this.animated_text.tick(time);
    }

    public async getAssetsCount(): Promise<number> {
        return Object.keys(this.twilight.resources.audio).length
            + Object.keys(this.twilight.resources.images).length;
    }

    public async load(loadingState: LoadingStateInteface): Promise<void> {
        await this.asset_loader.createLoaderPromise(
            this.twilight.resources.images,
            {},
            this.twilight.resources.audio,
            {},
            {},
            loadingState
        );
    }

    public initialize(scene_manager: SceneManager, stage: Stage): void {
        this.stage = stage;
        this.scene_manager = scene_manager;
        this.animated_text = new AnimatedText();
        this.game_state.setBackgroundSize(
            {
                width: (stage.canvas as HTMLCanvasElement).width,
                height: (stage.canvas as HTMLCanvasElement).height,
            }
        );

        // const proceedLength = Math.max(0, this.twilight.proceeding.length - 20);
        // for (let i = 0; i < 330; i++) {
        //     this.game_state.proceedNovel();
        // }

        stage.on('click', () => {
            this.proceedNovel();
        })

        this.renderState(false);
    }

    handleKeyDown(key: string): void {
        switch (key) {
            case KEY_ENTER:
            case KEY_ARROW_RIGHT:
                this.proceedNovel();
                break;
            case KEY_ARROW_LEFT:
                this.revertNovel();
                break;
        }
    }

    private proceedNovel(): void {
        if (this.clock.isAnimating()) {
            this.clock.stop();
        }

        if (this.animated_text?.isAnimating()) {
            this.animated_text.end();
            return;
        }

        if (this.screen_animation.isAnimating()) {
            this.screen_animation.end();
            return;
        }

        const [hasContinuation, isRepeat] = this.game_state.proceedNovel();
        if (!hasContinuation) {
            this.scene_manager.nextScene();
            return;
        }

        this.renderState(isRepeat);
    }

    private revertNovel(): void {
        if (this.clock.isAnimating()) {
            this.clock.stop();
        }

        if (this.animated_text?.isAnimating()) {
            this.animated_text.end();
            return;
        }

        if (this.screen_animation.isAnimating()) {
            this.screen_animation.end();
            return;
        }

        this.game_state.revertNovel();
        this.renderState(true);
    }

    /**
     * isRepeat - scene has already been read and this is repeat
     */
    private renderState(isRepeat: boolean): void {
        clearTimeout(this.auto_transition_timeout);
        
        const {game_state} = this;
        const screen_state = game_state.getCurrentScene();
        const {background, text} = screen_state;

        const screenWidth = (this.stage.canvas as HTMLCanvasElement).width;
        const screenHeight = (this.stage.canvas as HTMLCanvasElement).height;

        const newOuterContainer = new Container();
        newOuterContainer.setBounds(0, 0, screenWidth, screenHeight);
        newOuterContainer.name = 'outer-container';
        this.stage.children = [newOuterContainer, ...this.stage.children];

        const filters = [];
        if (!!text.content) {
            const filter = new ColorMatrixFilter(
                (new ColorMatrix)
                    .adjustBrightness(-25)
                    .adjustContrast(-30)
            );
            filter.name = 'text-filter';

            filters.push(filter);
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

        newOuterContainer.addChild(this.renderBackground(filters));
        newOuterContainer.addChild(...this.renderCharaters(screen_state.characters, filters));
        if (background.effect.includes(EFFECT_RAIN)) {
            const rain = this.getBitmap('e_rain', screenWidth, screenHeight);
            rain.name = this.ELEMENT_RAIN;
            rain.compositeOperation = 'screen';
            newOuterContainer.addChild(rain);
        }

        if (background.effect.includes(EFFECT_CINEMATIC)) {
            this.renderCinematic(newOuterContainer);
        }

        if (background.effect.includes(EFFECT_META)) {
            this.renderMeta(newOuterContainer, filters);
        }

        newOuterContainer.addChild(...this.renderCharaters(screen_state.characters_meta  || {}, filters));

        const transition = isRepeat ? null : game_state.getCurrentScene()?.effects?.transition;
        const transitionSpeed = game_state.getCurrentScene()?.effects?.transition_speed || null;
        const previousOuterContainer = (this.stage.children[this.stage.children.length - 1] as Container);
        // removing text before animating
        this.animated_text.stopAnimating();
        previousOuterContainer.children = previousOuterContainer
            .children
            .filter((child) => {
                return child.name !== AnimatedText.ANIMATION_NAME
                    && child.name !== AnimatedText.TEXT_NAME;
            });

        if (!screen_state.text.content) {
            previousOuterContainer.children.forEach((child) => {
                if (child.filters && child.filters.length) {
                    child.filters = child.filters.filter((filter: ColorMatrixFilter) => filter?.name !== 'text-filter');
                    child.cache(0, 0, child.getBounds().width, child.getBounds().height);
                }
            });
        }

        this.screen_animation
            .runAnimation(transition, transitionSpeed, previousOuterContainer)
            .then(() => {
                this.stage.children = [];
                this.stage.addChild(newOuterContainer);
                const effects = game_state.getCurrentScene()?.effects;
                return this.screen_animation
                    .runAnimation(isRepeat ? null : effects?.visual, null, newOuterContainer);
            })
            .then(() => {
                const effects = game_state.getCurrentScene()?.effects;
                if (effects?.clock) {
                    const clock = effects.clock;
                    const clocks = this.clock.renderClocks(clock.to, clock.from || null);

                    clocks.x = clock.position === 'bottom-right' || clock.position === 'right' 
                        ? screenWidth - 3 * clocks.getBounds().width / 4
                        : (
                            clock.position === 'center'
                                ? screenWidth / 2 - clocks.getBounds().width / 2
                                : 0
                        );
                    clocks.y = clock.position === 'bottom-right' 
                        ? screenHeight - 3 * clocks.getBounds().height / 4
                        : (
                            clock.position === 'right' || clock.position === 'center'
                                ? screenHeight / 2 - clocks.getBounds().height / 2
                                : 0
                        );

                    newOuterContainer.addChild(clocks);
                }

                this.renderText(isRepeat, newOuterContainer);

                this.auto_transition_timeout = effects?.auto_transition !== undefined
                    && setTimeout(() => {
                        this.proceedNovel();
                    }, 
                    effects.auto_transition
                );

                if (!isRepeat && effects?.sound) {
                    setTimeout(
                        () => {
                            const audio = this.asset_manager.getAudio(effects.sound);
                            this.bgm.playEffect(audio);
                        }, 
                        effects.sound_delay || 0
                    );
                }

                if (!isRepeat && typeof effects?.bgm !== 'undefined') {
                    if (null === effects.bgm) {
                        this.bgm.stop('bgm');
                    } else {
                        this.bgm.play(this.asset_manager.getAudio(effects.bgm), 'bgm');
                    }
                }

                const ambient = game_state.getCurrentScene()?.ambient;
                Object.keys(ambient || {}).forEach((name) => {
                    const audioName = ambient[name];
                    if (null === audioName) {
                        this.bgm.stop(name);
                        return;
                    }

                    const audio = this.asset_manager.getAudio(audioName);
                    this.bgm.play(audio, name, 'ignore');
                });
            });
    }

    private renderBackground(filters: Filter[]): DisplayObject {
        const background = this.game_state.getCurrentScene().background;

        const screenWidth = (this.stage.canvas as HTMLCanvasElement).width;
        const screenHeight = (this.stage.canvas as HTMLCanvasElement).height;

        let object: DisplayObject;
        if (background.url === 'white' || background.url === 'black') {
            object = new Shape();
            (object as Shape)
                .graphics
                .beginFill(background.url)
                .drawRect(0, 0, screenWidth, screenHeight);
            object.setBounds(0, 0, screenWidth, screenHeight);
        } else {
            object = this.getBitmap(background.url, screenWidth, screenHeight);
        }

        object.name = this.OBJECT_BACKGROUND;
        object.filters = filters;
        object.cache(0, 0, object.getBounds().width, object.getBounds().height);

        return object;
    }

    private renderCharaters(characters, filters: Filter[]): DisplayObject[] {
        const {stage} = this;
        const screenHeight = (stage.canvas as HTMLCanvasElement).height;

        const z_indexed: Character[][] = [[],[],[],[],[],[],[]];

        Object.keys(characters).forEach((position: string) => {
            if (!!characters[position]) {
                z_indexed[characters[position]["z-index"] - 1].push(characters[position]);
            }
        });

        return z_indexed.reduce((result: DisplayObject[], characters_array: Character[]) => {
            return [
                ...result,
                ...characters_array.map((character: Character) => {
                    const bitmap = this.getBitmap(character.url, character.width, screenHeight);
                    bitmap.x = character.x;
                    bitmap.y = 0;
                    bitmap.filters = filters;
                    bitmap.cache(0, 0, bitmap.getBounds().width, bitmap.getBounds().height);
                    
                    return bitmap;
                })
            ];
        }, []);
    }

    private renderText(isRepeat: boolean, container: Container): void {
        const {game_state} = this;
        const screen_state = game_state.getCurrentScene();
        const {text} = screen_state;

        const tokens = this.text_render_calculator.calculate(text.content || '');
        const nextProceeding = game_state.getNextProceeding();
        const isEndOfPage = !nextProceeding || !nextProceeding.text || nextProceeding.text.style === 'replace';

        this.animated_text.setRenderingTarget(container);
        if (isRepeat) {
            this.animated_text.render(tokens, isEndOfPage);
        } else {
            this.animated_text.queue(tokens, isEndOfPage);
        }
    }

    private renderCinematic(container: Container): void {
        const height = 100;

        const screenHeight = (this.stage.canvas as HTMLCanvasElement).height;
        const screenWidth = (this.stage.canvas as HTMLCanvasElement).width;

        const shape = new Shape();
        shape.setBounds(0, 0, screenWidth, screenHeight);
        shape
            .graphics
            .beginFill('black')
            .drawRect(0, 0, screenWidth, height)
            .drawRect(0, screenHeight - height, screenWidth, height)
            .endFill();

        container.addChild(shape);
    }

    private renderMeta(container: Container, filters: Filter[]): void {
        const flowersTop = this.asset_manager.getImage('flowers_top');
        const flowersTopBitmap = this.getBitmap('flowers_top', flowersTop.width / 2, flowersTop.height / 2);
        flowersTopBitmap.x = 0;
        flowersTopBitmap.y = 0;
        flowersTopBitmap.filters = filters;
        flowersTopBitmap.cache(0, 0, flowersTopBitmap.getBounds().width, flowersTopBitmap.getBounds().height);
        container.addChild(flowersTopBitmap);

        const flowersBottom = this.asset_manager.getImage('flowers_bottom');
        const flowersBottomBitmap = this.getBitmap('flowers_bottom', flowersBottom.width / 2, flowersBottom.height / 2);
        flowersBottomBitmap.x = 0;
        flowersBottomBitmap.y = (this.stage.canvas as HTMLCanvasElement).height - flowersBottom.height / 2;
        flowersBottomBitmap.filters = filters;
        flowersBottomBitmap.cache(0, 0, flowersBottomBitmap.getBounds().width, flowersBottomBitmap.getBounds().height);
        container.addChild(flowersBottomBitmap);
    }

    private getBitmap(url: string, width: number, height: number): Bitmap {
        const {asset_manager} = this;

        const img = asset_manager.getImage(url);
        return getBitmap(img, width, height);
    }
}