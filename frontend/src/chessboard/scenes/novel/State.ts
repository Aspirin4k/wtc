import {Character, Proceeding, ScreenState} from "./ScreenStateInterface";

import {AssetManager} from "../../helpers/AssetManager";
import { getCharacterX } from "./CharacterOffset";
import { Size } from "../../ui/Interfaces";

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
    private backgroundSize: Size;

    private screen_state: ScreenState;

    private proceeding_current_num: number = 0;
    private proceedings: Proceeding[];
    private revert_proceedings: Proceeding[] = [];

    private listeners: (() => void)[] = [];

    public constructor(asset_manager: AssetManager, twilight: any) {
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

    public setBackgroundSize(size: Size): void {
        this.backgroundSize = size;
    }

    /**
     * Продвижение новелы назад
     */
    public revertNovel() {
        let proceeding: Proceeding;
        do {
            if (this.proceeding_current_num === 0) {
                return;
            }

            proceeding = this.revert_proceedings[this.proceeding_current_num - 1];
            this.proceed(proceeding);
            this.proceeding_current_num--;
        } while (proceeding.should_be_skipped);
    }

    /**
     * Продвижение новелы вперед
     */
    public proceedNovel() {
        let isRepeating: boolean;
        let isAutoProceeding: boolean;
        do {
            if (this.proceeding_current_num >= this.proceedings.length) {
                return [false, false];
            }

            const proceeding = this.proceedings[this.proceeding_current_num];
            const revertProceeding = this.proceed(proceeding);

            isRepeating = true;
            if (!this.revert_proceedings[this.proceeding_current_num]) {
                this.revert_proceedings.push(revertProceeding);
                isRepeating = false;
            }

            isAutoProceeding = typeof proceeding.effects?.auto_transition !== 'undefined';
            this.proceeding_current_num++;
        } while(isRepeating && isAutoProceeding)

        return [true, isRepeating];
    }

    public getNextProceeding(): Proceeding {
        return this.proceedings[this.proceeding_current_num] || null;
    }

    /**
     * Продвигает новелу согласно переданному событию
     * Возвращает событие, которое позволяет откатить изменения
     */
    private proceed(proceeding: Proceeding): Proceeding {
        const new_state: ScreenState = { 
            ...this.screen_state,
            effects: null 
        };

        const revert_proceeding: Proceeding = {};
        revert_proceeding.should_be_skipped = typeof this.screen_state.effects?.auto_transition !== 'undefined';

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

        if (typeof proceeding.ambient !== 'undefined') {
            revert_proceeding.ambient = Object.keys(proceeding).reduce((res, name) => ({
                ...res,
                [name]: new_state.ambient[name] || null
            }), {});
            new_state.ambient = proceeding.ambient;
        }

        if (typeof proceeding.characters !== 'undefined') {
            if (proceeding.characters === null) {
                proceeding.characters = {
                    left_left: null,
                    left: null,
                    left_middle: null,
                    middle: null,
                    right_middle: null,
                    right: null,
                    right_right: null,
                };
            }

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

        if (typeof proceeding.characters_meta !== 'undefined') {
            if (proceeding.characters_meta === null) {
                proceeding.characters_meta = {
                    left: null,
                    middle: null,
                    right: null,
                };
            }

            revert_proceeding.characters_meta = {};
            Object.keys(new_state.characters_meta || {}).forEach((char_position) => {
                if (typeof proceeding.characters_meta[char_position] !== 'undefined') {
                    revert_proceeding.characters_meta[char_position] = new_state.characters_meta[char_position];
                    const character = proceeding.characters_meta[char_position];
                    character && this.hydrateCharCoordinates(character, char_position);
                    new_state.characters_meta[char_position] = character;
                }
            })
        }

        if (typeof proceeding.text !== 'undefined') {
            if (proceeding.text === null) {
                proceeding.text = {
                    content: '',
                    style: PROCEEDING_TEXT_REPLACE,
                    character: PROCEEDING_TEXT_NARRATOR,
                };
            }

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
                ? new_state.text.content + '<BREAK>' + new_text
                : new_text;

            revert_proceeding.text = {
                content: new_state.text.content,
                character: PROCEEDING_TEXT_NARRATOR,
                style: PROCEEDING_TEXT_REPLACE
            }

            new_state.text.content = new_text;
            new_state.text.character = proceeding.text.character;
        }

        if (typeof proceeding.effects !== 'undefined') {
            new_state.effects = proceeding.effects;
        }

        this.screen_state = new_state;
        this.listeners.forEach((callback) => {
            callback();
        });

        return revert_proceeding;
    }

    hydrateCharCoordinates(character: Character, position: string) {
        character.width = this.asset_manager.getImage(character.url).width / 2;
        const characterCenter = character.width / 2;
        switch (position) {
            case 'left_left':
                character.x = this.backgroundSize.width / 8 - characterCenter;
                break;
            case 'left':
                character.x = this.backgroundSize.width / 4 - characterCenter;
                break;
            case 'left_middle':
                character.x = 3 * this.backgroundSize.width / 8 - characterCenter;
                break;
            case 'middle':
                character.x = this.backgroundSize.width / 2 - characterCenter;
                break;
            case 'right_middle':
                character.x = 5 * this.backgroundSize.width / 8 - characterCenter;
                break;
            case 'right':
                character.x = 3 * this.backgroundSize.width / 4 - characterCenter;
                break;
            case 'right_right':
            default:
                character.x = 7 * this.backgroundSize.width / 8 - characterCenter;
                break;
        }
    }
}

export { State };