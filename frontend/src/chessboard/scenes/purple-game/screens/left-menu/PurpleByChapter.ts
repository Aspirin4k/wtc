import { DisplayObject } from "createjs-module";
import { Renderable } from "../../InterfaceState";
import { Container } from "../../../../ui/Container";
import { Label } from "../../../../ui/Label";
import { AssetManager } from "../../../../helpers/AssetManager";
import { Element } from "../../../../ui/Element";
import { Image } from "../../../../ui/Image";
import { ExactPosition, Size } from "../../../../ui/Interfaces";
import { PurpleStatemets } from "../../PurpleStatemets";
import { RenderTokenCalculator } from "../../../novel/text/RenderTokenCalculator";
import { MultiPageText } from "../../../../ui/MultiPageText";
import { ucfirst } from "../../../../helpers/String";

export class PurpleByChapter implements Renderable {
    private readonly asset_manager: AssetManager;
    private readonly backgroundSize: Size;
    private readonly onReRender: () => void;
    private readonly twilights: any[];
    
    private readonly text_render_calculator: RenderTokenCalculator;
    private readonly purpleStatements: PurpleStatemets;

    private selectedChapter: string = '';

    public constructor(
        asset_manager: AssetManager,
        backgroundSize: Size,
        onReRender: () => void,
        ...twilights
    ) {
        this.asset_manager = asset_manager;
        this.backgroundSize = backgroundSize;
        this.onReRender = onReRender;
        this.twilights = twilights;
        this.text_render_calculator = new RenderTokenCalculator();

        this.purpleStatements = new PurpleStatemets(...twilights);
    }

    public render(): DisplayObject[] {
        return [
            !this.selectedChapter
                ? this.renderPurpleEmptyChapter()
                : this.renderPurplePhrasesByChapter(this.selectedChapter)
        ];
    }

    private renderPurpleEmptyChapter(): DisplayObject {
        const hasTwoColumns = this.twilights.length > 3;
        
        const windowWidth = 379;
        const windowHeight = 418;
        const children = [
            new Container(
                {
                    position: {x: 0, y: 0},
                    size: {
                        width: windowWidth,
                        height: windowHeight,
                    },
                    background: 'black',
                    transparency: 0.6,
                }
            ),
            this.getColumn(
                this.twilights.slice(0, 3),
                {x: 0, y: 0},
                {width: hasTwoColumns ? windowWidth / 2 : windowWidth, height: windowHeight}
            ),
        ];

        if (hasTwoColumns) {
            children.push(
                this.getColumn(
                    this.twilights.slice(3),
                    {x: windowWidth / 2, y: 0},
                    {width: windowWidth / 2, height: windowHeight}
                )
            );
        }

        return new Container(
            {
                position: {
                    x: 222,
                    y: 31
                }
            },
            children
        )
            .getCreateJSObject()
    }

    private getColumn(twilights: any[], position: ExactPosition, size: Size): Container {
        return new Container(
            {
                position,
                alignChildren: {horizontal: 'center', vertical: 'middle'},
                size,
                childrenSpacing: 35
            },
            twilights.map((twilight) => this.getTwilightButton(twilight, size.width))
        )
    }

    private getTwilightButton(twilight, parentWidth: number): Element {
        const iconSize: Size = {
            width: 56,
            height: 72
        }

        return new Container(
            {
                alignChildren: {vertical: 'top', horizontal: 'center'},
                size: {width: parentWidth},
                childrenSpacing: 5,
                on_click: () => {
                    this.selectedChapter = twilight.name;
                    this.onReRender();
                },
                on_rollover: (self: Container) => {
                    const children = self.getChildren();
                    const rows = twilight.deaths.length > 3
                        ? (children[1] as Container).getChildren()
                        : [children[1]];

                    rows.forEach((row: Element) => {
                        row.setTransparency(1);
                    })
                },
                on_rollout: (self: Container) => {
                    const children = self.getChildren();
                    const rows = twilight.deaths.length > 3
                        ? (children[1] as Container).getChildren()
                        : [children[1]];

                    rows.forEach((row: Element) => {
                        row.setTransparency(0.6);
                    })
                },
            },
            [
                new Label({
                    text: twilight.name,
                    font: 'ITC Bookman Light',
                    fontSize: 14,
                    color: 'white',
                }),
                twilight.deaths.length > 3
                ? new Container(
                    {
                        alignChildren: {vertical: 'top'},
                        childrenSpacing: 0
                    },
                    [
                        this.getPortraitRow(twilight.deaths.slice(0, 3), {width: iconSize.width / 2, height: iconSize.height / 2}),
                        this.getPortraitRow(twilight.deaths.slice(3), {width: iconSize.width / 2, height: iconSize.height / 2})
                    ]
                )
                : this.getPortraitRow(twilight.deaths, iconSize)
            ]
        )
    }

    private getPortraitRow(deaths: string[], iconSize: Size): Container {
        return new Container(
            {
                alignChildren: {horizontal: 'center'},
                childrenDirection: 'row',
                childrenSpacing: 0,
                transparency: 0.6
            },
            deaths.map((character) => {
                return new Image(
                    this.asset_manager,
                    {
                        // @ts-ignore
                        background: ['ui_victim_portrait', `PortraitVictim${ucfirst(character)}.png`],
                        size: iconSize,
                    }
                )
            }),
        );
    }

    private renderPurplePhrasesByChapter(chapter: string): DisplayObject {
        const phrases = this.purpleStatements.getByChapter(chapter);

        return new Container(
            {
                position: {x: 0, y: 0},
                size: this.backgroundSize,
            },
            [
                new Container(
                    {
                        position: {x: 212, y: 31},
                        size: {
                            width: 379,
                            height: 418
                        },
                        background: '#371b1b',
                        transparency: 0.8,
                    }
                ),
                new Container(
                    {
                        position: {x: 212, y: 31},
                        size: {
                            width: 379,
                            height: 418
                        },
                    },
                    [
                        new MultiPageText(
                            this.text_render_calculator,
                            {
                                position: {x: 10, y: 10},
                                size: {width: 363, height: 378},
                                header_style: {
                                    font: 'ITC Bookman Medium',
                                    font_size: 16,
                                },
                                text_style: {
                                    font: 'ITC Bookman Light',
                                    font_size: 14,
                                },
                                control_style: {  
                                    font: 'ITC Bookman Light',
                                    font_size: 20,
                                    click_sound: this.asset_manager.getAudio('click07'),
                                },
                                paragraph_padding: 16,
                                paragraphs: phrases.map((phrase) => ({
                                    header: ucfirst(phrase.actor),
                                    text: `"${phrase.phrase.trim()}"` + '\n\n',
                                }))
                            }
                        )
                    ]
                )
            ]
        )
            .getCreateJSObject();
    }
};