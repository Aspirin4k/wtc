import { DisplayObject } from "createjs-module";
import { AssetManager } from "../../../../helpers/AssetManager";
import { Image } from "../../../../ui/Image";
import { Container } from "../../../../ui/Container";
import { Label } from "../../../../ui/Label";
import { CulpritBoard } from "../../CulpritBoard";
import { buildCulprits } from "../../CulpritBuilder";
import { Size } from "../../../../ui/Interfaces";
import { Game } from "../../Scene";

export class CulpritSelect {
    private readonly asset_manager: AssetManager;

    private readonly game: Game;

    private readonly backgroundSize: Size;
    private readonly onBack: () => void;
    private readonly onRender: (objects: DisplayObject[]) => void;

    private readonly selected_characters: string[] = [];

    constructor(
        asset_manager: AssetManager,
        game: Game,
        backgroundSize: Size,
        onBack: () => void,
        onRender: (objects: DisplayObject[]) => void,
    ) {
        this.asset_manager = asset_manager;
        this.game = game;
        this.backgroundSize = backgroundSize;
        this.onBack = onBack;
        this.onRender = onRender;

        this.render();
    }
    
    public render() {
        this.onRender([
            this.renderBackground(),
            this.renderBattler(),
            this.renderSelectCulprit()
        ])
    }

    private renderBackground(): DisplayObject {
        return new Image(
            this.asset_manager,
            {
                position: {x: 0, y: 0},
                size: this.backgroundSize,
                background: 'b_different_space_1a',
            }
        )
            .getCreateJSObject()
    }

    private renderBattler(): DisplayObject {
        return new Image(
            this.asset_manager,
            {
                position: {x: -50, y: 0},
                background: 'battler',
            }
        )
            .getCreateJSObject();
    }

    private renderSelectCulprit(): DisplayObject {
        return new Container(
            {
                position: {x: 420, y: 65}
            },
            [
                new Image(
                    this.asset_manager,
                    {
                        position: {x: 0, y: 0},
                        background: ['ui_element', 'LabelSelectCulprit.png'],
                        alignChildren: {horizontal: 'center', vertical: 'middle'}
                    },
                    [
                        new Label({
                            text: 'Select the culprit',
                            font: 'ITC Bookman Light',
                            color: 'white',
                            fontSize: 17,
                            shadow: {
                                color: 'white',
                                y: 1,
                                x: 1,
                                blur: 3
                            }
                        })
                    ]
                ),
                new CulpritBoard(
                    this.asset_manager, 
                    buildCulprits(this.game, this.selected_characters, (character) => {
                        this.asset_manager.getAudio('click07').play();
                        if (this.selected_characters.includes(character)) {
                            this.selected_characters.splice(this.selected_characters.indexOf(character), 1);
                        } else {
                            this.selected_characters.push(character);
                        }
                        this.render();
                    })
                ).render({x: 0, y: 35}),
                new Image(
                    this.asset_manager,
                    {
                        position: {x: 0, y: 262},
                        background: ['ui_element', 'ButtonCulprit.png'],
                        backgroundOver: ['ui_element', 'ButtonCulprit_selected.png'],
                        on_click: () => {
                            this.asset_manager.getAudio('click07').play();
                            this.onBack();
                        },
                        alignChildren: {
                            horizontal: 'center'
                        },
                    },
                    [
                        new Label({
                            text: 'Return to main menu',
                            font: 'ITC Bookman Light',
                            color: 'white',
                            fontSize: 14,
                            shadow: {
                                color: 'black',
                                y: 2,
                                x: -2,
                                blur: 2
                            },
                            position: {y: 12}
                        })
                    ]
                ),
                new Image(
                    this.asset_manager,
                    {
                        position: {x: 0, y: 294},
                        background: ['ui_element', 'ButtonCulprit.png'],
                        backgroundOver: ['ui_element', 'ButtonCulprit_selected.png'],
                        alignChildren: {
                            horizontal: 'center'
                        },
                    },
                    [
                        new Label({
                            text: 'Confirm',
                            font: 'ITC Bookman Light',
                            color: 'white',
                            fontSize: 14,
                            shadow: {
                                color: 'black',
                                y: 2,
                                x: -2,
                                blur: 2
                            },
                            position: {y: 12}
                        })
                    ]
                )
            ]
        )
            .getCreateJSObject()
    }
}