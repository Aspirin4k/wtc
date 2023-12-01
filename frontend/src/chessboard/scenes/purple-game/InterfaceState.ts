import { DisplayObject } from "createjs-module";
import { AssetManager } from "../../helpers/AssetManager";
import { Container } from "../../ui/Container";
import { Image } from "../../ui/Image";
import { Label } from "../../ui/Label";
import { SCENE_NOVEL, SceneManager } from "../SceneManager";

import twilight1 from "../../classic/twilight/1_twilight.json";
import twilight2 from "../../classic/twilight/2_twilight.json";
import twilight4 from "../../classic/twilight/4_twilight.json";
import twilight56 from "../../classic/twilight/5-6_twilight.json";
import twilight7 from "../../classic/twilight/7_twilight.json";
import twilight8 from "../../classic/twilight/8_twilight.json";
import { CulpritBoard } from "./CulpritBoard";
import { buildCulprit } from "./CulpritBuilder";

export class InterfaceState {
    private readonly currentState: DisplayObject[] = []

    private readonly asset_manager: AssetManager;
    private readonly scene_manager: SceneManager;

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    private readonly culpritBoard: CulpritBoard;

    constructor(asset_manager: AssetManager, sceneManager: SceneManager, screenWidth: number, screenHeight: number) {
        this.asset_manager = asset_manager;
        this.scene_manager = sceneManager;

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        const battler = buildCulprit('battler', '#a11e46', {left: true});
        const eva = buildCulprit('eva', '#a11e46', {top: true});
        const genji = buildCulprit('genji', '#2c1378');
        const george = buildCulprit('george', '#a11e46', {left: true});
        const gohda = buildCulprit('gohda', '#2c1378', {left: true});
        const hideyoshi = buildCulprit('hideyoshi', '#a11e46', {left: true});
        const jessica = buildCulprit('jessica', '#a11e46', {left: true});
        const kanon = buildCulprit('kanon', '#2c1378', {left: true});
        const krauss = buildCulprit('krauss');
        const kumasawa = buildCulprit('kumasawa', '#2c1378', {left: true});
        const kyrie = buildCulprit('kyrie', '#a11e46', {left: true});
        const maria = buildCulprit('maria', '#a11e46', {left: true});
        const nanjo = buildCulprit('nanjo');
        const natsuhi = buildCulprit('natsuhi', '#a11e46', {left: true});
        const rosa = buildCulprit('rosa', '#a11e46', {right: true, top: true});
        const rudolf = buildCulprit('rudolf', '#a11e46', {top: true});
        const shannon = buildCulprit('shannon', '#2c1378', {top: true});
        this.culpritBoard = new CulpritBoard(
            asset_manager,
            [
                [null, krauss, natsuhi, jessica],
                [nanjo, eva, hideyoshi, george],
                [null, rudolf, kyrie, battler],
                [genji, rosa, null, maria],
                [shannon, kanon, gohda, kumasawa],
            ]
        );

        this.currentState = [
            this.renderBackground(),
            this.renderLeftMenu(),
            this.renderBernkastel()
        ]
    }

    public getCurrentState(): DisplayObject[] {
        return this.currentState;
    }

    private openChaptersMenu(): void {
        this.currentState.splice(0, this.currentState.length);
        this.currentState.push(this.renderBackground());
        this.currentState.push(this.renderLeftMenu());
        this.currentState.push(this.renderChapterSelectMenu());
    }

    private openRules(): void {
        this.currentState.splice(0, this.currentState.length);
        this.currentState.push(this.renderBackground());
        this.currentState.push(this.renderLeftMenu());
        this.currentState.push(this.renderRules());
    }

    private openCulpritSelect(): void {
        this.currentState.splice(0, this.currentState.length);
        this.currentState.push(this.renderBackground('b_different_space_1a'));
        this.currentState.push(this.renderBattler());
        this.currentState.push(this.renderSelectCulprit());
    }

    private renderBackground(background = 'b_different_space_2d'): DisplayObject {
        return new Image(
            this.asset_manager,
            {
                position: {x: 0, y: 0},
                size: {width: this.screenWidth, height: this.screenHeight},
                background,
            }
        )
            .getCreateJSObject()
    }

    private renderLeftMenu(): DisplayObject {
        return new Container(
            {
                position: {x: 24, y: 260},
                size: {width: 170, height: 190},
            },
            [
                new Image(
                    this.asset_manager,
                    {
                        position: {x: 0, y: 0},
                        size: {width: 170, height: 190},
                        background: 'ui_menu',
                        transparency: 0.5,
                    }
                ),
                new Container(
                    {
                        position: {
                            x: 0,
                            y: 15
                        },
                        size: {width: 170, height: 175},
                        alignChildren: {
                            horizontal: 'center',
                            vertical: 'top'
                        },
                        childrenSpacing: 1
                    },
                    [
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button',
                                backgroundOver: 'ui_button_selected',
                                on_click: () => this.openChaptersMenu(),
                            },
                            [
                                new Label(
                                    {
                                        position: {x: 9, y: 8},
                                        text: 'Read again',
                                        font: 'ITC Bookman Medium',
                                        fontSize: 18,
                                        color: '#ffffff',
                                        shadow: {
                                            color: '#dddd83'
                                        }
                                    }
                                )
                            ]
                        ),
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button',
                                backgroundOver: 'ui_button_selected',
                                on_click: () => this.openRules(),
                            },
                            [
                                new Label(
                                    {
                                        position: {x: 9, y: 8},
                                        text: 'Show rules',
                                        font: 'ITC Bookman Medium',
                                        fontSize: 18,
                                        color: '#ffffff',
                                        shadow: {
                                            color: '#dddd83'
                                        }
                                    }
                                )
                            ]
                        ),
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button',
                                backgroundOver: 'ui_button_selected',
                            },
                            [
                                new Label(
                                    {
                                        position: {x: 9, y: 8},
                                        text: 'Check purple',
                                        font: 'ITC Bookman Medium',
                                        fontSize: 18,
                                        color: '#ffffff',
                                        shadow: {
                                            color: '#dddd83'
                                        }
                                    }
                                )
                            ]
                        ),
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button',
                                transparency: 0.2
                            },
                            [
                                new Label(
                                    {
                                        position: {x: 9, y: 8},
                                        text: 'Hints',
                                        font: 'ITC Bookman Medium',
                                        fontSize: 18,
                                        color: '#ffffff',
                                        shadow: {
                                            color: '#dddd83'
                                        },
                                    }
                                )
                            ]
                        ),
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button',
                                backgroundOver: 'ui_button_selected',
                                on_click: () => this.openCulpritSelect(),
                            },
                            [
                                new Label(
                                    {
                                        position: {x: 9, y: 8},
                                        text: 'Culprit Select',
                                        font: 'ITC Bookman Medium',
                                        fontSize: 18,
                                        color: '#ffffff',
                                        shadow: {
                                            color: '#dddd83'
                                        }
                                    }
                                )
                            ]
                        )
                    ]
                )
            ]
        )
            .getCreateJSObject();
    }

    private renderBernkastel(): DisplayObject {
        return new Image(
            this.asset_manager,
            {
                position: {x: 230, y: 0},
                background: 'bernkastel',
            }
        )
            .getCreateJSObject();
    }

    private renderChapterSelectMenu(): DisplayObject {
        return new Container(
            {
                position: {x: 230, y: 30},
                size: {width: 320, height: 420},
            },
            [
                new Image(
                    this.asset_manager,
                    {
                        position: {x: 0, y: 0},
                        size: {width: 320, height: 420},
                        background: 'ui_chapter_select',
                        transparency: 0.8,
                    }
                ),
                new Container(
                    {
                        position: {
                            x: 0,
                            y: 108
                        },
                        size: {
                            width: 320,
                        },
                        alignChildren: {
                            vertical: 'top',
                            horizontal: 'center'
                        },
                        childrenSpacing: 2
                    },
                    [
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button_wide',
                                backgroundOver: 'ui_button_wide_selected',
                                alignChildren: {
                                    vertical: 'middle',
                                    horizontal: 'center'
                                },
                                on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight1),
                            },
                            [
                                new Label({
                                    font: 'ITC Bookman Light',
                                    fontSize: 13,
                                    color: '#ffffff',
                                    text: 'The First Twilight'
                                })
                            ]
                        ),
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button_wide',
                                backgroundOver: 'ui_button_wide_selected',
                                alignChildren: {
                                    vertical: 'middle',
                                    horizontal: 'center'
                                },
                                on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight2),
                            },
                            [
                                new Label({
                                    font: 'ITC Bookman Light',
                                    fontSize: 13,
                                    color: '#ffffff',
                                    text: 'The Second Twilight'
                                })
                            ]
                        ),
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button_wide',
                                backgroundOver: 'ui_button_wide_selected',
                                alignChildren: {
                                    vertical: 'middle',
                                    horizontal: 'center'
                                },
                                on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight4),
                            },
                            [
                                new Label({
                                    font: 'ITC Bookman Light',
                                    fontSize: 13,
                                    color: '#ffffff',
                                    text: 'The Fourth Twilight'
                                })
                            ]
                        ),
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button_wide',
                                backgroundOver: 'ui_button_wide_selected',
                                alignChildren: {
                                    vertical: 'middle',
                                    horizontal: 'center'
                                },
                                on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight56),
                            },
                            [
                                new Label({
                                    font: 'ITC Bookman Light',
                                    fontSize: 13,
                                    color: '#ffffff',
                                    text: 'The Fifth/Sixth Twilight'
                                })
                            ]
                        ),
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button_wide',
                                backgroundOver: 'ui_button_wide_selected',
                                alignChildren: {
                                    vertical: 'middle',
                                    horizontal: 'center'
                                },
                                on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight7),
                            },
                            [
                                new Label({
                                    font: 'ITC Bookman Light',
                                    fontSize: 13,
                                    color: '#ffffff',
                                    text: 'The Seventh Twilight'
                                })
                            ]
                        ),
                        new Image(
                            this.asset_manager,
                            {
                                background: 'ui_button_wide',
                                backgroundOver: 'ui_button_wide_selected',
                                alignChildren: {
                                    vertical: 'middle',
                                    horizontal: 'center'
                                },
                                on_click: () => this.scene_manager.changeScene(SCENE_NOVEL, twilight8),
                            },
                            [
                                new Label({
                                    font: 'ITC Bookman Light',
                                    fontSize: 13,
                                    color: '#ffffff',
                                    text: 'The Eighth Twilight'
                                })
                            ]
                        )
                    ]
                )
            ]
        )
            .getCreateJSObject();
    }

    private renderRules(): DisplayObject {
        return new Container(
            {
                position: {x: 0, y: 0},
                size: {width: this.screenWidth, height: this.screenHeight},
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
                            text: "⬤ A 'culprit' is defined as 'one who murders'\n\n"
                                + "⬤ It is possible for a culprit to lie.\n\n"
                                + "⬤ It is possible for a culprit to lie even before committing murder.\n\n"
                                + "⬤ Characters who are not culprits only speak the truth.\n\n"
                                + "⬤ Characters who are not culprits may not cooperate with a culprit.\n\n"
                                + "⬤ A culprit must carry out all murders directly, by their own hands.\n\n"
                                + "⬤ A culprit must not die.\n\n"
                                + "⬤ A culprit must be among the characters appearing in the story.\n\n"
                                + "⬤ Purple statements are as absolute as red truths. However, a culprit, and only a culprit, may lie with purple statements.\n\n"
                                + "⬤ Outside of spoken statements, there are no lies in the narration.",
                            font: 'ITC Bookman Light',
                            fontSize: 13,
                            color: 'white',
                            position: {
                                x: 8,
                                y: 20
                            },
                            size: {
                                width: 360
                            }
                        })
                    ]
                )
            ]
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
                        background: 'ui_label_select_culprit',
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
                this.culpritBoard.render({x: 0, y: 35}),
                new Image(
                    this.asset_manager,
                    {
                        position: {x: 0, y: 262},
                        background: 'ui_button_culprit',
                        backgroundOver: 'ui_button_culprit_selected',
                        on_click: () => this.openChaptersMenu(),
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
                        background: 'ui_button_culprit',
                        backgroundOver: 'ui_button_culprit_selected',
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
};