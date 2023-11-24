import { Container, ContainerOptions } from "./Container";
import { Element } from "./Element";
import { getBitmap } from "../helpers/Image";
import { AssetManager } from "../helpers/AssetManager";
import { ExactPosition } from "./Interfaces";

export class Image extends Container {
    constructor(
        asset_manager: AssetManager,
        options: ContainerOptions, 
        children: Element[] = []
    ) {
        let img;
        if (options.background) {
            img = asset_manager.getImage(options.background);

            if (!options.size) {
                options.size = {
                    width: img.width / 2,
                    height: img.height / 2,
                }
            }
        }

        super(
            {...options, background: null}, 
            children
        );

        if (img) {
            this.initImage(img, options.position)
        }
    }

    private initImage(background: HTMLImageElement, position: ExactPosition | null): void {
        const bitmap = getBitmap(
            background,
            this.renderObject.getBounds()?.width, 
            this.renderObject.getBounds()?.height
        );
        
        if (position) {
            bitmap.x = position.x;
            bitmap.y = position.y;
        }

        this.renderObject.children = [
            bitmap, 
            ...this.renderObject.children
        ];
    }
}