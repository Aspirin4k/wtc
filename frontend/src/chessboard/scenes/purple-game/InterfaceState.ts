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

export class InterfaceState {
    private readonly currentState: DisplayObject[] = []

    private readonly asset_manager: AssetManager;
    private readonly scene_manager: SceneManager;

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    constructor(asset_manager: AssetManager, sceneManager: SceneManager, screenWidth: number, screenHeight: number) {
        this.asset_manager = asset_manager;
        this.scene_manager = sceneManager;

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

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


    private renderBackground(): DisplayObject {
        return new Image(
            this.asset_manager,
            {
                position: {x: 0, y: 0},
                size: {width: this.screenWidth, height: this.screenHeight},
                background: 'b_different_space_2d',
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
};