import { DisplayObject, Tween } from "createjs-module";
import { AssetManager } from "../../../../helpers/AssetManager";
import { Image } from "../../../../ui/Image";
import { Container } from "../../../../ui/Container";
import { Label } from "../../../../ui/Label";
import { CulpritBoard } from "../../CulpritBoard";
import { buildCulprits } from "../../CulpritBuilder";
import { Size } from "../../../../ui/Interfaces";
import { Game } from "../../Scene";
import { BGM } from "../../../novel/BGM";
import { Effect } from "../../../novel/ScreenStateInterface";

export class CulpritSelect {
    private readonly asset_manager: AssetManager;
    private readonly bgm: BGM;

    private readonly game: Game;

    private readonly backgroundSize: Size;
    private readonly onBack: () => void;
    private readonly onRender: (objects: DisplayObject[]) => void;
    private readonly toggleMouse: (enabled: boolean) => void;

    private readonly battler_default: DisplayObject;
    private readonly battler_solved: DisplayObject;
    private readonly battler_wrong: DisplayObject;

    private readonly selected_characters: string[] = [];

    constructor(
        asset_manager: AssetManager,
        bgm: BGM,
        game: Game,
        backgroundSize: Size,
        onBack: () => void,
        onRender: (objects: DisplayObject[]) => void,
        toggleMouse: (enabled: boolean) => void,
    ) {
        this.asset_manager = asset_manager;
        this.bgm = bgm;
        this.game = game;
        this.backgroundSize = backgroundSize;
        this.onBack = onBack;
        this.onRender = onRender;
        this.toggleMouse = toggleMouse;

        this.battler_default = this.renderBattler();
        this.battler_solved = this.renderBattler('battler_solved');
        this.battler_solved.alpha = 0;
        this.battler_wrong = this.renderBattler('battler_wrong');
        this.battler_wrong.alpha = 0;

        this.render();
    }
    
    public render() {
        this.onRender([
            this.renderBackground(),
            this.renderSelectCulprit(),
            this.battler_default,
            this.battler_solved,
            this.battler_wrong,
        ])
    }

    private renderSelectedCulprits() {
        Tween
            .get(this.battler_solved)
            .to({alpha: 1}, 150)
            .call(() => this.battler_default.alpha = 0);
    }

    private renderWrongAnswer() {
        Tween
            .get(this.battler_wrong)
            .to({alpha: 1}, 150)
            .call(() => this.battler_solved.alpha = 0);
    }

    private renderDefaultBattler() {
        Tween
            .get(this.battler_default)
            .to({alpha: 1}, 150)
            .call(() => this.battler_wrong.alpha = 0);
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

    private renderBattler(battler: string = 'battler'): DisplayObject {
        const sprite = this.asset_manager.getImage(battler);

        return new Image(
            this.asset_manager,
            {
                position: {x: 160 - sprite.width / 4, y: 0},
                background: battler,
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
                        this.bgm.playEffect(this.asset_manager.getAudio('click07'));
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
                            this.bgm.playEffect(this.asset_manager.getAudio('click07'));
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
                        backgroundOver: this.selected_characters.length 
                            ? ['ui_element', 'ButtonCulprit_selected.png']
                            : null,
                        alignChildren: {
                            horizontal: 'center'
                        },
                        on_click: () => {
                            if (!this.selected_characters.length) {
                                return;
                            }

                            this.bgm.playEffect(this.asset_manager.getAudio('confirm_culprits'));
                            this.toggleMouse(false);
                            this.renderSelectedCulprits();
                            setTimeout(() => {
                                if (
                                    this.selected_characters.length !== this.game.solution.length || 
                                    this.selected_characters.filter((char) => !this.game.solution.includes(char)).length > 0
                                ) {
                                    this.bgm.playEffect(this.asset_manager.getAudio('ahaha'));
                                    this.renderWrongAnswer();
                                    setTimeout(() => {
                                        this.toggleMouse(true);
                                        this.renderDefaultBattler();
                                    }, 1000);
                                    return;
                                }
                            }, 1500)
                        }
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