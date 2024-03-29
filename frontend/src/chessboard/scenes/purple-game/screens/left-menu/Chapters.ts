import { DisplayObject } from "createjs-module";
import { Label } from "../../../../ui/Label";
import { AssetManager } from "../../../../helpers/AssetManager";
import { Container } from "../../../../ui/Container";
import { Image } from "../../../../ui/Image";
import { Renderable } from "../../InterfaceState";
import { BGM } from "../../../novel/BGM";

export type Chapter = {
    name: string,
    on_click: () => void,
}

export class Chapters implements Renderable {
    private readonly asset_manager: AssetManager;
    private readonly bgm: BGM;
    private readonly chapters: Chapter[];

    constructor(asset_manager: AssetManager, bgm: BGM, chapters: Chapter[]) {
        this.asset_manager = asset_manager;
        this.bgm = bgm;
        this.chapters = chapters;
    }

    public render(): DisplayObject[] {
        return [
            new Container(
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
                        this.chapters.map((chapter) => new Image(
                            this.asset_manager,
                            {
                                background: ['ui_element', 'ButtonWide.png'],
                                backgroundOver: ['ui_element', 'ButtonWide_selected.png'],
                                alignChildren: {
                                    vertical: 'middle',
                                    horizontal: 'center'
                                },
                                on_click: () => {
                                    this.bgm.playEffect(this.asset_manager.getAudio('page'));
                                    chapter.on_click();
                                }
                            },
                            [
                                new Label({
                                    font: 'ITC Bookman Light',
                                    fontSize: 13,
                                    color: '#ffffff',
                                    text: chapter.name
                                })
                            ]
                        ))
                    )
                ]
            )
                .getCreateJSObject()
        ];
    }
}