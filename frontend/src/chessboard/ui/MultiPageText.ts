import { Container, DisplayObject, Shadow, Shape, Text } from "createjs-module";
import { RenderTokenCalculator, TextTokenInterface } from "../scenes/novel/text/RenderTokenCalculator";
import { Element, ElementOptions } from "./Element";
import { TEXT_FONT_FAMILY, TEXT_FONT_SIZE } from "../scenes/novel/text/Constants";
import { ExactPosition } from "./Interfaces";

type TextStyle = {
    font?: string,
    font_size?: number,
}

type MultiPageTextOptions = ElementOptions & {
    size: {
        width: number,
        height: number,
    }
    header_style?: TextStyle,
    text_style?: TextStyle,
    control_style?: TextStyle,
    paragraph_padding?: number,
    paragraphs: {
        header: string,
        text: string,
    }[],
}

export class MultiPageText extends Element {
    protected readonly renderObject: Container;

    private readonly text_render_calculator: RenderTokenCalculator;
    private readonly options: MultiPageTextOptions;

    private readonly pages: Text[][] = [];
    private currentPageNum: number = 0;

    constructor(text_render_calculator: RenderTokenCalculator, options: MultiPageTextOptions) {
        super(options);

        this.text_render_calculator = text_render_calculator;
        this.options = options;

        this.renderObject = new Container();
        this.renderObject.setBounds(0, 0, options.size.width, options.size.height);
        this.renderObject.name = 'MultiPageText';
        
        this.renderText(options);
    }

    private renderPage() {
        this.renderObject.children = [];
        this.pages[this.currentPageNum].forEach((text) => {
            this.renderObject.addChild(text);
        })

        if (this.currentPageNum > 0) {
            this.renderObject.addChild(this.renderBackButton());
        }

        if (this.currentPageNum < this.pages.length - 1) {
            this.renderObject.addChild(this.renderNextButton());
        }
    }

    private renderText(options: MultiPageTextOptions): void {
        let paragraphOffsetY = 0;
        let currentPage: Text[] = [];
        options.paragraphs.forEach((paragraph) => {
            const headerTokens = this.calculateTextTokens(paragraph.header, options.header_style, options.size.width);
            const textTokens = this.calculateTextTokens(paragraph.text, options.text_style, options.size.width);

            const headerHeight = this.calculateTextHeight(headerTokens);
            const textHeight = this.calculateTextHeight(textTokens);
            const paragraphHeight = headerHeight + textHeight;

            if (paragraphOffsetY + paragraphHeight + (options.paragraph_padding || 0) > options.size.height) {
                this.pages.push(currentPage);
                currentPage = [];
                paragraphOffsetY = 0;
            }

            currentPage.push(
                ...this.converToCreateJSText(headerTokens, options.header_style, paragraphOffsetY),
                ...this.converToCreateJSText(textTokens, options.text_style, paragraphOffsetY + headerHeight)
            )
            paragraphOffsetY += paragraphHeight + (options.paragraph_padding || 0);
        });

        if (currentPage.length > 0) {
            this.pages.push(currentPage);
        }

        this.renderPage();
    }

    private renderNextButton(): DisplayObject {
        return this.renderButton(
            'Next', 
            {x: -this.options.size.width + 8, y: this.options.size.height - 10},
            () => {
                console.log('test');
                this.currentPageNum++;
                this.renderPage();
            }
        );
    }

    private renderBackButton(): DisplayObject {
        return this.renderButton(
            'Back', 
            {x: 8, y: this.options.size.height - 10},
            () => {
                this.currentPageNum--;
                this.renderPage();
            }
        );
    }

    private renderButton(buttonText: string, position: ExactPosition, onClick: () => void) {
        const container = new Container();

        const style = this.getTextStyle(this.options.control_style);
        const text = new Text(
            buttonText,
            `${style.font_size}px ${style.font}`
        );
        text.color = 'white';
        text.shadow = new Shadow('black', 2, 2, 1);

        let x = position.x;
        if (x < 0) {
            x = -x - text.getMeasuredWidth();
        }

        text.x = x;
        text.y = position.y;

        container.addChild(text);

        const hitArea = new Shape();
        hitArea.graphics
            .beginFill('#000')
            .drawRect(
                container.getBounds().x, 
                container.getBounds().y, 
                container.getBounds().width, 
                container.getBounds().height
            );
        container.hitArea = hitArea;

        container.on('click', onClick);
        container.mouseChildren = false;
        return container;
    }

    private calculateTextTokens(text: string, style: TextStyle | null, width: number): TextTokenInterface[] {
        style = this.getTextStyle(style);
        return this.text_render_calculator.calculate(
            text,
            {
                font_family: style.font,
                font_size: style.font_size,
                width: width,
            }
        )
    }

    private calculateTextHeight(tokens: TextTokenInterface[]): number {
        if (!tokens.length) {
            return 0;
        }

        const lastLine = tokens[tokens.length - 1];
        return lastLine.offset_y + (lastLine.line_num + 1) * tokens[0].line_height;
    }

    private converToCreateJSText(tokens: TextTokenInterface[], style: TextStyle | null, offsetY: number): Text[] {
        style = this.getTextStyle(style);
        return tokens.map((textToken) => {
            const createjsText = new Text(
                textToken.text,
                `${style.font_size}px ${style.font}`
            );
            createjsText.color = textToken.color;
    
            createjsText.x = textToken.offset_x;
            createjsText.y = textToken.offset_y + textToken.line_num * textToken.line_height + offsetY;
    
            return createjsText;
        });
    }

    private getTextStyle(style: TextStyle | null): TextStyle {
        if (!style) {
            style = {};
        }

        if (!style.font) {
            style.font = TEXT_FONT_FAMILY;
        }

        if (!style.font_size) {
            style.font_size = TEXT_FONT_SIZE;
        }

        return style;
    }
}