import {Character, Text} from "../ScreenStateInterface";
import {State} from "./State";
import {AssetManager} from "../helpers/AssetManager";
import {TEXT_FONT_FAMILY, TEXT_FONT_SIZE, TEXT_LINE_HEIGHT, TEXT_X_OFFSET, TEXT_Y_OFFSET} from "./text/Constants";
import {RenderTokenCalculator, TextTokenInterface} from "./text/RenderTokenCalculator";
import {LoggerFactory} from "../../logger/LoggerFactory";

export const CLASSIC_SCREEN_WIDTH = 640;
export const CLASSIC_SCREEN_HEIGHT = 480;

const FPS_50 = 1000 / 50;

const EFFECT_GRAYSCALE = 'grayscale';
const EFFECT_RAIN = 'rain';

const EFFECT_MAP = {
    grayscale: 'brightness(0.65) grayscale(1)'
}

class Renderer {
    private asset_manager: AssetManager;
    private text_render_token_calculator: RenderTokenCalculator;

    private canvas: HTMLCanvasElement;

    private game_render_loop;
    private game_state: State;

    private cache_lines: TextTokenInterface[] = [];

    constructor(
        game_state: State,
        asset_manager: AssetManager,
        text_render_token_calculator: RenderTokenCalculator
    ) {
        this.game_state = game_state;
        this.asset_manager = asset_manager;
        this.text_render_token_calculator = text_render_token_calculator;

        this.game_state.onStateChange(() => {
            this.cache_lines = [];
        });
    }

    public register(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.game_render_loop = setInterval(this.tryRenderGameFrame.bind(this), FPS_50);
    }

    public unregister() {
        clearInterval(this.game_render_loop);
    }

    tryRenderGameFrame() {
        try {
            this.renderGameFrame();
        } catch (e) {
            clearInterval(this.game_render_loop);
            LoggerFactory.getLogger().error('Render exception', {error: e});
        }
    }

    renderGameFrame() {
        const canvas = this.canvas;
        const context = canvas.getContext('2d');
        const {game_state, asset_manager} = this;
        const screen_state = game_state.getCurrentScene();
        const {background, characters, text} = screen_state;

        // Если на сцене есть текст, то фон затемнен
        if (!!text.content) {
            context.filter = 'brightness(0.65)';
        }

        // Кастомный эффект на сцене
        background.effect.forEach((effect: string) => {
            if (EFFECT_MAP[effect]) {
                // TODO: складывать эффекты
                context.filter = EFFECT_MAP[effect] || 'none';
            }
        })

        context.drawImage(asset_manager.getImage(background.url), 0, 0, canvas.width, canvas.height);
        this.renderCharacters(context, characters);

        if (background.effect.includes(EFFECT_RAIN)) {
            context.globalCompositeOperation = 'screen';
            context.drawImage(asset_manager.getImage('e_rain'), 0, 0, canvas.width, canvas.height);
            context.globalCompositeOperation = 'source-over';
        }

        context.filter = 'none';
        this.renderText(context, text);
    }

    renderCharacters(context: CanvasRenderingContext2D, characters: {[pos: string]: Character | null}) {
        const z_indexed: Character[][] = [[],[],[]];

        Object.keys(characters).forEach((position: string) => {
            if (!!characters[position]) {
                z_indexed[characters[position]["z-index"] - 1].push(characters[position]);
            }
        });

        const { asset_manager } = this;
        z_indexed.forEach((characters_array: Character[]) => {
            characters_array.forEach((character: Character) => {
                context.drawImage(asset_manager.getImage(character.url), character.x, 0, character.width, CLASSIC_SCREEN_HEIGHT)
            });
        });
    }

    renderText(context: CanvasRenderingContext2D, text: Text) {
        if (!text.content) {
            return;
        }

        context.shadowColor = '#000000';
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.font = `${TEXT_FONT_SIZE}px ${TEXT_FONT_FAMILY}`;

        if (!this.cache_lines.length) {
            this.cache_lines = this.text_render_token_calculator.calculate(context, text.content);
        }

        this.cache_lines.forEach((line: TextTokenInterface) => {
            context.fillStyle = line.color;
            context.fillText(line.text, line.offset_x + TEXT_X_OFFSET, line.offset_y + line.line_num * TEXT_LINE_HEIGHT + TEXT_Y_OFFSET);
        });
    }
}

export { Renderer };