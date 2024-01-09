import { DisplayObject } from "createjs-module";
import { Image } from "../../../../ui/Image";
import { AssetManager } from "../../../../helpers/AssetManager";
import { Renderable } from "../../InterfaceState";
import { Size } from "../../../../ui/Interfaces";

export class BernakstelSelected implements Renderable {
    private readonly asset_manager: AssetManager;
    private readonly backgroundSize: Size;

    constructor(asset_manager: AssetManager, backgroundSize: Size) {
        this.asset_manager = asset_manager;
        this.backgroundSize = backgroundSize;
    }

    public render(): DisplayObject[] {
        return [
            new Image(
                this.asset_manager,
                {
                    position: {x: 230, y: 0},
                    background: 'bernkastel_selected',
                }
            )
                .getCreateJSObject(),
            new Image(
                this.asset_manager,
                {
                    position: {x: 0, y: 0},
                    size: this.backgroundSize,
                    background: 'e_broken_glass'
                }
            )
                .getCreateJSObject(),
        ]
    }
}