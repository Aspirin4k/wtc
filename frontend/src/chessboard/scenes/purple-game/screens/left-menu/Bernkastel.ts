import { DisplayObject } from "createjs-module";
import { Image } from "../../../../ui/Image";
import { AssetManager } from "../../../../helpers/AssetManager";
import { Renderable } from "../../InterfaceState";

export class Bernkastel implements Renderable {
    private readonly asset_manager: AssetManager;

    constructor(asset_manager: AssetManager) {
        this.asset_manager = asset_manager;
    }

    public render(): DisplayObject[] {
        return [
            new Image(
                this.asset_manager,
                {
                    position: {x: 230, y: 0},
                    background: 'bernkastel',
                }
            )
                .getCreateJSObject()
        ]
    }
}