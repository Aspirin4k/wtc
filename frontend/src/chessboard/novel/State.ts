import {Character, Proceeding, ScreenState} from "../ScreenStateInterface";

import twilight from "../classic/twilight/7_twilight.json";
import {AssetManager} from "../helpers/AssetManager";

const CLASSIC_SPRITE_LEFT_X = -75;
const CLASSIC_SPRITE_RIGHT_X = 270;

const PROCEEDING_TEXT_ADD = 'add';
const PROCEEDING_TEXT_REPLACE = 'replace';
const PROCEEDING_TEXT_NARRATOR = 'narrator';
const PROCEEDING_TEXT_STATEMENT_START = 'start';
const PROCEEDING_TEXT_STATEMENT_CONTINUE = 'continue';
const PROCEEDING_TEXT_STATEMENT_END = 'end';

class State {
    private asset_manager: AssetManager;

    private screen_state: ScreenState;

    private proceeding_current_num: number = 0;
    private proceedings: Proceeding[];
    private revert_proceedings: Proceeding[] = [];

    private listeners: (() => void)[] = [];

    public constructor(asset_manager: AssetManager) {
        this.asset_manager = asset_manager;

        this.screen_state = twilight.scene;
        // @ts-ignore
        this.proceedings = twilight.proceeding;
    }

    public getCurrentScene(): ScreenState {
        return this.screen_state;
    }

    public onStateChange(callback: () => void) {
        this.listeners.push(callback);
    }

    /**
     * Продвижение новелы назад
     */
    public revertNovel() {
        if (this.proceeding_current_num === 0) {
            return;
        }

        const proceeding = this.revert_proceedings.pop();
        this.proceed(proceeding);
        this.proceeding_current_num--;
    }

    /**
     * Продвижение новелы вперед
     */
    public proceedNovel() {
        if (this.proceeding_current_num >= this.proceedings.length) {
            return;
        }

        const proceeding = this.proceedings[this.proceeding_current_num];
        this.revert_proceedings.push(this.proceed(proceeding));
        this.proceeding_current_num++;
    }

    /**
     * Продвигает новелу согласно переданному событию
     * Возвращает событие, которое позволяет откатить изменения
     */
    private proceed(proceeding: Proceeding): Proceeding {
        const new_state = { ...this.screen_state };

        const revert_proceeding: Proceeding = {};

        if (typeof proceeding.background !== 'undefined') {
            revert_proceeding.background = {
                url: new_state.background.url,
                effect: new_state.background.effect
            }
            new_state.background = {
                url: proceeding.background.url,
                effect: typeof proceeding.background.effect === 'undefined'
                    ? new_state.background.effect
                    : proceeding.background.effect
            }
        }

        if (typeof proceeding.characters !== 'undefined') {
            revert_proceeding.characters = {};
            Object.keys(new_state.characters).forEach((char_position) => {
                if (typeof proceeding.characters[char_position] !== 'undefined') {
                    revert_proceeding.characters[char_position] = new_state.characters[char_position];
                    const character = proceeding.characters[char_position];
                    character && this.hydrateCharCoordinates(character, char_position);
                    new_state.characters[char_position] = character;
                }
            })
        }

        if (typeof proceeding.text !== 'undefined') {
            let new_text = proceeding.text.content;

            if (proceeding.text.statement === PROCEEDING_TEXT_STATEMENT_START) {
                new_text = '"' + new_text;
            }

            if (proceeding.text.statement === PROCEEDING_TEXT_STATEMENT_END) {
                new_text += '"\n';
            }

            if (
                proceeding.text.character !== PROCEEDING_TEXT_NARRATOR
                && typeof proceeding.text.statement === 'undefined'
            ) {
                new_text = '"' + new_text + '"\n';
            }

            new_text = proceeding.text.style === PROCEEDING_TEXT_ADD
                ? new_state.text.content + new_text
                : new_text;

            revert_proceeding.text = {
                content: new_state.text.content,
                character: PROCEEDING_TEXT_NARRATOR,
                style: PROCEEDING_TEXT_REPLACE
            }

            new_state.text.content = new_text;
            new_state.text.character = proceeding.text.character;
        }

        this.screen_state = new_state;
        this.listeners.forEach((callback) => {
            callback();
        });

        return revert_proceeding;
    }

    hydrateCharCoordinates(character: Character, position: string) {
        character.width = this.asset_manager.getImage(character.url).width / 2;
        switch (position) {
            case 'left':
                character.x = - character.width / 5;
                break;
            case 'middle':
                character.x = (640 - character.width) / 2
                break;
            case 'right':
            default:
                character.x = 320 - character.width / 6;
                break;
        }
    }
}

export { State };