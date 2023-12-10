import { DisplayObject } from "createjs-module";
import { AssetManager } from "../../../../helpers/AssetManager";
import { Container } from "../../../../ui/Container";
import { Size } from "../../../../ui/Interfaces";
import { Image } from "../../../../ui/Image";
import { Label } from "../../../../ui/Label";
import { Renderable } from "../../InterfaceState";

export class Rules implements Renderable {
    private readonly asset_manager: AssetManager;
    private readonly backgroundSize: Size;

    constructor(asset_manager: AssetManager, backgroundSize: Size) {
        this.asset_manager = asset_manager;
        this.backgroundSize = backgroundSize;
    }

    public render(): DisplayObject[] {
        return [
            new Container(
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
        ];
    }
}