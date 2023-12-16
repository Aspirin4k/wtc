import { DisplayObject, Text, Container as CreateJSContainer } from "createjs-module";
import { Renderable } from "../../InterfaceState";
import { CulpritBoard } from "../../CulpritBoard";
import { PurpleStatemets } from "../../PurpleStatemets";
import { AssetManager } from "../../../../helpers/AssetManager";
import { buildPurpleStatements } from "../../CulpritBuilder";
import { Container } from "../../../../ui/Container";
import { Size } from "../../../../ui/Interfaces";
import { Image } from "../../../../ui/Image";
import { Label } from "../../../../ui/Label";
import { RenderTokenCalculator } from "../../../novel/text/RenderTokenCalculator";
import { MultiPageText } from "../../../../ui/MultiPageText";
import { getCharacterX } from "../../../novel/CharacterOffset";

export class PurpleByCharacter implements Renderable {
    private readonly asset_manager: AssetManager;
    private readonly backgroundSize: Size;
    private readonly text_render_calculator: RenderTokenCalculator;

    private readonly purpleBoard: CulpritBoard
    private readonly purpleStatements: PurpleStatemets;

    private selectedCharacter: string = '';
    
    constructor(asset_manager: AssetManager, backgroundSize: Size, onReRender: () => void, ...twilights) {
        this.asset_manager = asset_manager;
        this.backgroundSize = backgroundSize;
        this.text_render_calculator = new RenderTokenCalculator();

        this.purpleBoard = new CulpritBoard(
            this.asset_manager, 
            buildPurpleStatements((selected) => {
                this.asset_manager.getAudio('click07').play();
                this.selectedCharacter = selected;
                onReRender();
            })
        );
        this.purpleStatements = new PurpleStatemets(...twilights);
    }

    public render(): DisplayObject[] {
        return [
            this.purpleBoard.render({x: 24, y: 28}).getCreateJSObject(),
            this.selectedCharacter
                ? this.renderPurplePhrasesByCharacter(this.selectedCharacter)
                : this.renderPurpleEmptyCharater()
        ]
    }

    private renderPurplePhrasesByCharacter(character: string): DisplayObject {
        const phrases = this.purpleStatements.getByCharater(character);

        return new Container(
            {
                position: {x: 0, y: 0},
                size: this.backgroundSize,
            },
            [
                new Image(
                    this.asset_manager,
                    {
                        background: `purple_${character}`,
                        position: {x: getCharacterX(character, 300), y: 0},
                        transparency: 0.3
                    }
                ),
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
                                    font_size: 18,
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
                                paragraphs: Object.keys(phrases).map((twilight) => ({
                                    header: `◼${twilight}`,
                                    text: phrases[twilight].map((phrase) => `"${phrase.trim()}"`).join('\n\n'),
                                }))
                            }
                        )
                    ]
                )
            ]
        )
            .getCreateJSObject();
    }

    private renderPurpleEmptyCharater(): DisplayObject {
        return new Container(
            {
                position: {x: 0, y: 0},
                size: this.backgroundSize,
            },
            [
                new Image(
                    this.asset_manager,
                    {
                        background: 'ui_flowers',
                        position: {x: 308, y: 94},
                        transparency: 0.5
                    }
                ),
                new Container(
                    {
                        position: {
                            x: 212,
                            y: 31
                        },
                        alignChildren: {
                            horizontal: 'center',
                            vertical: 'middle'
                        }
                    },
                    [
                        new Container(
                            {
                                position: {x: 0, y: 0},
                                size: {
                                    width: 379,
                                    height: 418
                                },
                                background: '#371b1b',
                                transparency: 0.8,
                            }
                        ),
                        new Label({
                            text: "Select a character whose purple statements you would like to check.",
                            font: 'ITC Bookman Light',
                            fontSize: 13,
                            color: 'white',
                            position: {
                                x: 190,
                                y: 185
                            },
                            size: {
                                width: 330
                            },
                            align_horizontal: 'center'
                        })
                    ]
                )  
        ])
            .getCreateJSObject();
    }
}