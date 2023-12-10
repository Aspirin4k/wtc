import { DisplayObject } from "createjs-module";
import { AssetManager } from "../../../../helpers/AssetManager";
import { Image } from "../../../../ui/Image";
import { Container } from "../../../../ui/Container";
import { Label } from "../../../../ui/Label";
import { CulpritBoard } from "../../CulpritBoard";
import { buildCulprits } from "../../CulpritBuilder";
import { Size } from "../../../../ui/Interfaces";

export class CulpritSelect {
    private readonly asset_manager: AssetManager;
    private readonly backgroundSize: Size;
    private readonly onBack: () => void;
    private readonly onRender: (objects: DisplayObject[]) => void;

    constructor(
        asset_manager: AssetManager,
        backgroundSize: Size,
        onBack: () => void,
        onRender: (objects: DisplayObject[]) => void,
    ) {
        this.asset_manager = asset_manager;
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
                new CulpritBoard(this.asset_manager, buildCulprits()).render({x: 0, y: 35}),
                new Image(
                    this.asset_manager,
                    {
                        position: {x: 0, y: 262},
                        background: 'ui_button_culprit',
                        backgroundOver: 'ui_button_culprit_selected',
                        on_click: this.onBack,
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
}