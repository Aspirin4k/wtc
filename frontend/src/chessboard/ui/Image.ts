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

        if (options.backgroundOver) {
            options.on_rollover = () => this.initImage(asset_manager.getImage(options.backgroundOver), options.position);
            options.on_rollout = () => this.initImage(asset_manager.getImage(options.background), options.position);
        }

        super(
            {
                ...options, 
                background: null
            }, 
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
        
        bitmap.name = 'image_background';
        if (position) {
            bitmap.x = position.x / background.width;
            bitmap.y = position.y / background.height;
        }

        if (this.renderObject.children[0] && this.renderObject.children[0].name === 'image_background') {
            this.renderObject.children[0] = bitmap;
        } else {
            this.renderObject.children = [
                bitmap, 
                ...this.renderObject.children
            ];
        }
    }
}