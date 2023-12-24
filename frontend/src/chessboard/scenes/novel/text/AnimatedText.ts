import { Container, Shadow, Text } from "createjs-module";
import { TextTokenInterface } from "./RenderTokenCalculator";
import { TEXT_FONT_FAMILY, TEXT_FONT_SIZE, TEXT_LINE_HEIGHT, TEXT_X_OFFSET, TEXT_Y_OFFSET } from "./Constants";
import { ExactPosition } from "../../../ui/Interfaces";

export class AnimatedText {
    private readonly TEXT_SPEED = 2;

    private container: Container;

    private readonly ANIMATION_NAME = 'animated-text-animation';

    private readonly ANIMATION_CONTINUE_FRAMES = [16, 17, 18, 19, 20, 21, 20, 19, 18, 17];
    private readonly ANIMATION_FRAME_CHANGE_MS = 60;
    private readonly ANIMATION_END_PAGE_FRAMES = [
        [0, 2], [0, 2],
        [1, 3], [1, 3],
        [2, 4], [2, 4],
        [1, 5], [1, 5], 
        [0, 6], [0, 6],
        [1, 5], [1, 5], 
        [2, 4], [2, 4],
        [1, 3], [1, 3],
    ];
    
    private readonly animationContinue: Text;
    private readonly animationEndPage: Text;

    private animationFrameNum: number = 0;
    private animationLastTick: number = 0;
    private isEndPageAnimation: boolean = false;

    private history: TextTokenInterface[] = [];
    private token_queue: TextTokenInterface[] = [];
    
    private current_characters: string[] = null;
    private current_text: Text = null;
    private last_character_position: ExactPosition = null;

    constructor() {
        this.animationContinue = new Text(' ▷', `${this.ANIMATION_CONTINUE_FRAMES[0]}px ${TEXT_FONT_FAMILY}`);
        this.animationContinue.name = this.ANIMATION_NAME;
        this.animationContinue.color = 'white';
        this.animationContinue.shadow = new Shadow('#000', 1, 1, 0);
        this.animationContinue.alpha = 0.6;

        this.animationEndPage = new Text('🗏', `${TEXT_FONT_SIZE}px ${TEXT_FONT_FAMILY}`);
        this.animationEndPage.name = this.ANIMATION_NAME;
        this.animationEndPage.color = 'white';
        this.animationEndPage.shadow = new Shadow('#000', 1, 1, 0);
        this.animationEndPage.alpha = 0.6;
    }

    public tick(time: number): void {
        if (null === this.current_text) {
            if (!this.token_queue.length) {
                this.animateEndSymbol(time);
                return;
            }

            const current_token = this.token_queue.shift();
            this.current_characters = current_token.text.split('');
            this.current_text = this.renderEmptyText(current_token);
            this.history.push(current_token);
        }

        for (let i = 0; i < this.TEXT_SPEED; i++) {
            this.current_text.text += this.current_characters.shift();
            if (!this.current_characters.length) {
                this.current_characters = null;
                this.current_text = null;
                break;
            }
        }
    }

    public setRenderingTarget(container: Container): void {
        this.container = container;
    }

    public queue(tokens: TextTokenInterface[], isEndOfPage: boolean): void {
        // game state always returns final state of text
        // so it includes previous tokens as well
        // we need to detect them and render immideately
        // (otherwire animation will be executed twice for them)
        const immideateRenderTokens = [];
        const animatedRenderTokens = [];
        tokens.forEach((token) => {
            const stringifiedToken = JSON.stringify(token);
            const historyToken = this.history.filter((historyToken) => stringifiedToken === JSON.stringify(historyToken))[0];
            if (historyToken) {
                immideateRenderTokens.push(token);
                return;
            }

            animatedRenderTokens.push(token);
        });

        if (immideateRenderTokens.length > 0) {
            this.render(immideateRenderTokens, false);
        } else {
            this.history = [];
        }

        this.saveLastTokenPosition(tokens, isEndOfPage);
        this.token_queue = animatedRenderTokens;
    }

    public render(tokens: TextTokenInterface[], isEndOfPage: boolean): void {
        this.saveLastTokenPosition(tokens, isEndOfPage);
        this.token_queue.push(...tokens);
        this.end();
    }

    public isAnimating(): boolean {
        return this.current_characters !== null
            || this.token_queue.length > 0;
    }

    public end(): void {
        while (this.isAnimating()) {
            this.tick(0);
        }
    }

    private animateEndSymbol(time: number): void {
        if (!this.last_character_position) {
            return;
        }

        if (time - this.animationLastTick < this.ANIMATION_FRAME_CHANGE_MS) {
            return;
        }

        const animationObject = this.isEndPageAnimation ? this.animationEndPage : this.animationContinue;
        if (!this.container.getChildByName(this.ANIMATION_NAME)) {
            this.container.addChild(animationObject);
        }

        if (this.isEndPageAnimation) {
            this.animateEndPage();
        } else {
            this.animateContinue();
        }

        this.animationLastTick = time;
    }

    private animateEndPage(): void {
        this.animationFrameNum++;
        if (this.animationFrameNum >= this.ANIMATION_END_PAGE_FRAMES.length) {
            this.animationFrameNum = 0;
        }

        const animationOffset = this.ANIMATION_END_PAGE_FRAMES[this.animationFrameNum];
        this.animationEndPage.x = this.last_character_position.x + animationOffset[1];
        this.animationEndPage.y = this.last_character_position.y + animationOffset[0] - 1;
    }

    private animateContinue(): void {
        this.animationFrameNum++;
        if (this.animationFrameNum >= this.ANIMATION_CONTINUE_FRAMES.length) {
            this.animationFrameNum = 0;
        }

        const fontSize = this.ANIMATION_CONTINUE_FRAMES[this.animationFrameNum];
        this.animationContinue.font = `${fontSize}px ${TEXT_FONT_FAMILY}`;
        this.animationContinue.x = this.last_character_position.x + (22 - fontSize) / 2;
        this.animationContinue.y = this.last_character_position.y + (22 - fontSize) / 2 - 1;
    }

    private renderEmptyText(token: TextTokenInterface): Text {
        const createjsText = new Text(
            '',
            `${TEXT_FONT_SIZE}px ${TEXT_FONT_FAMILY}`
        );
        createjsText.color = token.color;

        const shadow = new Shadow('#000', 1, 1, 0);
        createjsText.shadow = shadow;

        const position = this.getPositionByToken(token);
        createjsText.x = position.x;
        createjsText.y = position.y;

        this.container.addChild(createjsText);

        return createjsText;
    }

    private saveLastTokenPosition(tokens: TextTokenInterface[], isEndOfPage: boolean): void {
        if (tokens.length > 0) {
            const lastToken = tokens[tokens.length - 1];
            const lastTokenPosition = this.getPositionByToken(lastToken);
            this.last_character_position = {
                x: TEXT_X_OFFSET + lastToken.line_end,
                y: lastTokenPosition.y,
            }
            this.isEndPageAnimation = isEndOfPage;
            return;
        }

        this.last_character_position = null;
    }

    private getPositionByToken(token: TextTokenInterface): ExactPosition {
        return {
            x: token.offset_x + TEXT_X_OFFSET,
            y: token.offset_y + token.line_num * TEXT_LINE_HEIGHT + TEXT_Y_OFFSET,
        }
    }
};
