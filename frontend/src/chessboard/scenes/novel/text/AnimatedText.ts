import { Shadow, Stage, Text } from "createjs-module";
import { TextTokenInterface } from "./RenderTokenCalculator";
import { TEXT_FONT_FAMILY, TEXT_FONT_SIZE, TEXT_LINE_HEIGHT, TEXT_X_OFFSET, TEXT_Y_OFFSET } from "./Constants";

export class AnimatedText {
    private readonly TEXT_SPEED = 2;
    private readonly stage: Stage;

    private history: TextTokenInterface[] = [];
    private token_queue: TextTokenInterface[] = [];
    
    private current_characters: string[] = null;
    private current_text: Text = null;

    constructor(stage: Stage) {
        this.stage = stage;
    }

    public tick(): void {
        if (null === this.current_text) {
            if (!this.token_queue.length) {
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

    public queue(tokens: TextTokenInterface[]): void {
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
            this.render(immideateRenderTokens);
        } else {
            this.history = [];
        }

        this.token_queue = animatedRenderTokens;
    }

    public render(tokens: TextTokenInterface[]): void {
        this.token_queue.push(...tokens);
        this.end();
    }

    public isAnimating(): boolean {
        return this.current_characters !== null
            || this.token_queue.length > 0;
    }

    public end(): void {
        while (this.isAnimating()) {
            this.tick();
        }
    }

    private renderEmptyText(token: TextTokenInterface): Text {
        const createjsText = new Text(
            '',
            `${TEXT_FONT_SIZE}px ${TEXT_FONT_FAMILY}`
        );
        createjsText.color = token.color;

        const shadow = new Shadow('#000', 1, 1, 0);
        createjsText.shadow = shadow;

        createjsText.x = token.offset_x + TEXT_X_OFFSET;
        createjsText.y = token.offset_y + token.line_num * TEXT_LINE_HEIGHT + TEXT_Y_OFFSET;

        this.stage.addChild(createjsText);

        return createjsText;
    }
};
