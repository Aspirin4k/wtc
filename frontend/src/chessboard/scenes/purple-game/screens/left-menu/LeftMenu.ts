import { DisplayObject, Graphics, Shape, Container as CreateJSContainer } from "createjs-module";
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
import { BGM } from "../../../novel/BGM";
import { Game } from "../../Scene";
import { BernakstelSelected } from "./BernkastelSelected";
import { ScreenAnimation } from "../../../novel/animation/ScreenAnimation";

export class LeftMenu {
    private readonly asset_manager: AssetManager;
    private readonly bgm: BGM;
    private readonly screen_animation: ScreenAnimation;

    private readonly game: Game;

    private readonly backgroundSize: Size;
    private readonly chapters: Chapter[];
    private readonly onCulpritSelectClick: () => void;
    private readonly onRender: (objects: DisplayObject[]) => void;
    private readonly toggleMouse: (enabled: boolean) => void;
    private readonly twilights;

    private readonly elements_container: CreateJSContainer;

    private currentSelection: Renderable;

    constructor(
        asset_manager: AssetManager,
        bgm: BGM,
        game: Game,
        backgroundSize: Size, 
        chapters: Chapter[],
        onCulpritSelectClick: () => void, 
        onRender: (objects: DisplayObject[]) => void,
        toggleMouse: (enabled: boolean) => void,
        twilights
    ) {
        this.asset_manager = asset_manager;
        this.bgm = bgm;
        this.game = game;
        this.backgroundSize = backgroundSize;
        this.chapters = chapters;
        this.onCulpritSelectClick = onCulpritSelectClick;
        this.onRender = onRender;
        this.toggleMouse = toggleMouse;
        this.twilights = twilights;

        // white fade in animation
        this.screen_animation = new ScreenAnimation();
        this.elements_container = new CreateJSContainer();
        this.elements_container.setBounds(0, 0, backgroundSize.width, backgroundSize.height);

        this.currentSelection = new Bernkastel(asset_manager);
        this.render();
    }

    public render() {
        this.elements_container.children = [
            this.renderBackground(),
            this.renderLeftMenu(),
            ...this.currentSelection.render(),
        ];

        this.onRender([
            new Shape(
                new Graphics()
                    .beginFill('white')
                    .drawRect(0, 0, this.backgroundSize.width, this.backgroundSize.height - 1)
            ),
            this.elements_container,
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
                                    this.bgm.playEffect(this.asset_manager.getAudio('click07'));
                                    this.currentSelection = new Chapters(this.asset_manager, this.bgm, this.chapters);
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
                                    this.bgm.playEffect(this.asset_manager.getAudio('click07'));
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
                                    this.bgm.playEffect(this.asset_manager.getAudio('click07'));
                                    this.currentSelection = new PurpleModal(
                                        this.asset_manager,
                                        this.bgm,
                                        this.backgroundSize,
                                        () => {
                                            this.currentSelection = new PurpleByCharacter(
                                                this.asset_manager,
                                                this.bgm,
                                                this.game,
                                                this.backgroundSize,
                                                this.render.bind(this),
                                                ...this.twilights
                                            );
                                            this.render();
                                        },
                                        () => {
                                            this.currentSelection = new PurpleByChapter(
                                                this.asset_manager,
                                                this.bgm,
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
                                    this.toggleMouse(false);
                                    this.bgm.playEffect(this.asset_manager.getAudio('culprit_select_screen'));
                                    this.currentSelection = new BernakstelSelected(this.asset_manager, this.backgroundSize);
                                    this.render();
                                    setTimeout(() => {   
                                        this.screen_animation.runAnimation(
                                            'fade-in',
                                            1000,
                                            this.elements_container
                                        )
                                            .then(() => {
                                                this.toggleMouse(true);
                                                this.onCulpritSelectClick();
                                            })
                                    }, 1500);
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