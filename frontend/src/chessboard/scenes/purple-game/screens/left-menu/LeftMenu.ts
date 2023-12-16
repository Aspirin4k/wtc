import { DisplayObject } from "createjs-module";
import { AssetManager } from "../../../../helpers/AssetManager";
import { Size } from "../../../../ui/Interfaces";
import { Image } from "../../../../ui/Image";
import { Container } from "../../../../ui/Container";
import { Label } from "../../../../ui/Label";
import { Bernkastel } from "./Bernkastel";
import { Chapter, Chapters } from "./Chapters";
import { Rules } from "./Rules";
import { Renderable } from "../../InterfaceState";
import { PurpleModal } from "./PurpleModal";
import { PurpleByCharacter } from "./PurpleByCharacter";
import { PurpleByChapter } from "./PurpleByChapter";

export class LeftMenu {
    private readonly asset_manager: AssetManager;
    private readonly backgroundSize: Size;
    private readonly chapters: Chapter[];
    private readonly onCulpritSelectClick: () => void;
    private readonly onRender: (objects: DisplayObject[]) => void;
    private readonly twilights;

    private currentSelection: Renderable;

    constructor(
        asset_manager: AssetManager, 
        backgroundSize: Size, 
        chapters: Chapter[],
        onCulpritSelectClick: () => void, 
        onRender: (objects: DisplayObject[]) => void,
        twilights
    ) {
        this.asset_manager = asset_manager;
        this.backgroundSize = backgroundSize;
        this.chapters = chapters;
        this.onCulpritSelectClick = onCulpritSelectClick;
        this.onRender = onRender;
        this.twilights = twilights;

        this.currentSelection = new Bernkastel(asset_manager);
        this.render();
    }

    public render() {
        this.onRender([
            this.renderBackground(),
            this.renderLeftMenu(),
            ...this.currentSelection.render(),
        ])
    }

    private renderBackground(): DisplayObject {
        return new Image(
            this.asset_manager,
            {
                position: {x: 0, y: 0},
                size: this.backgroundSize,
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
                                background: ['ui_element', 'Button.png'],
                                backgroundOver: ['ui_element', 'Button_selected.png'],
                                on_click: () => {
                                    this.asset_manager.getAudio('click07').play();
                                    this.currentSelection = new Chapters(this.asset_manager, this.chapters);
                                    this.render();
                                },
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
                                background: ['ui_element', 'Button.png'],
                                backgroundOver: ['ui_element', 'Button_selected.png'],
                                on_click: () => {
                                    this.asset_manager.getAudio('click07').play();
                                    this.currentSelection = new Rules(this.asset_manager, this.backgroundSize);
                                    this.render();
                                },
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
                                background: ['ui_element', 'Button.png'],
                                backgroundOver: ['ui_element', 'Button_selected.png'],
                                on_click: () => {
                                    this.asset_manager.getAudio('click07').play();
                                    this.currentSelection = new PurpleModal(
                                        this.asset_manager,
                                        this.backgroundSize,
                                        () => {
                                            this.currentSelection = new PurpleByCharacter(
                                                this.asset_manager,
                                                this.backgroundSize,
                                                this.render.bind(this),
                                                ...this.twilights
                                            );
                                            this.render();
                                        },
                                        () => {
                                            this.currentSelection = new PurpleByChapter(
                                                this.asset_manager,
                                                this.backgroundSize,
                                                this.render.bind(this),
                                                ...this.twilights
                                            );
                                            this.render();
                                        }
                                    );
                                    this.render();
                                },
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
                                background: ['ui_element', 'Button.png'],
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
                                background: ['ui_element', 'Button.png'],
                                backgroundOver: ['ui_element', 'Button_selected.png'],
                                on_click: () => {
                                    this.asset_manager.getAudio('click07').play();
                                    this.onCulpritSelectClick();
                                }
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
            .getCreateJSObject()
    }
}