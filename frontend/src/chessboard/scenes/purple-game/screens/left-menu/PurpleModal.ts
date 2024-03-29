import { DisplayObject } from "createjs-module";
import { Renderable } from "../../InterfaceState";
import { AssetManager } from "../../../../helpers/AssetManager";
import { Size } from "../../../../ui/Interfaces";
import { Label } from "../../../../ui/Label";
import { Image } from "../../../../ui/Image";
import { BGM } from "../../../novel/BGM";

export class PurpleModal implements Renderable {
    private readonly asset_manager: AssetManager;
    private readonly bgm: BGM;

    private readonly backgroundSize: Size;
    private readonly onByCharacterClick: () => void;
    private readonly onByChapterClick: () => void;

    constructor(
        asset_manager: AssetManager, 
        bgm: BGM,
        backgroundSize: Size, 
        onByCharacterClick: () => void,
        onByChapterClick: () => void
    ) {
        this.asset_manager = asset_manager;
        this.bgm = bgm;
        this.backgroundSize = backgroundSize;
        this.onByCharacterClick = onByCharacterClick;
        this.onByChapterClick = onByChapterClick;
    }

    public render(): DisplayObject[] {
        return [
            new Image(
                this.asset_manager,
                {
                    background: ['ui_element', 'Modal.png'],
                    position: {
                        x: (this.backgroundSize.width - 227) / 2,
                        y: (this.backgroundSize.height - 139) / 2
                    }
                },
                [
                    new Label({
                        position: {x: 113, y: 19},
                        size: {width: 197},
                        text: 'How would you like to view the purple statements?',
                        font: 'ITC Bookman Light',
                        color: 'white',
                        fontSize: 14,
                        align_horizontal: 'center'
                    }),
                    new Image(
                        this.asset_manager,
                        {
                            position: {x: 28, y: 60},
                            background: ['ui_element', 'ButtonCulprit.png'],
                            backgroundOver: ['ui_element', 'ButtonCulprit_selected.png'],
                            on_click: () => {
                                this.bgm.playEffect(this.asset_manager.getAudio('click01'));
                                this.onByCharacterClick();
                            }
                        },
                        [
                            new Label({
                                position: {x: 12, y: 7},
                                text: 'By character',
                                font: 'ITC Bookman Light',
                                color: 'white',
                                fontSize: 18,
                                shadow: {
                                    color: 'black',
                                    y: 1,
                                    x: 2,
                                    blur: 1
                                }
                            })
                        ]
                    ),
                    new Image(
                        this.asset_manager,
                        {
                            position: {x: 28, y: 93},
                            background: ['ui_element', 'ButtonCulprit.png'],
                            backgroundOver: ['ui_element', 'ButtonCulprit_selected.png'],
                            on_click: () => {
                                this.bgm.playEffect(this.asset_manager.getAudio('click01'));
                                this.onByChapterClick();
                            }
                        },
                        [
                            new Label({
                                position: {x: 12, y: 7},
                                text: 'By chapter',
                                font: 'ITC Bookman Light',
                                color: 'white',
                                fontSize: 18,
                                shadow: {
                                    color: 'black',
                                    y: 1,
                                    x: 2,
                                    blur: 1
                                }
                            })
                        ]
                    )
                ]
            )
                .getCreateJSObject()
        ];
    }
}