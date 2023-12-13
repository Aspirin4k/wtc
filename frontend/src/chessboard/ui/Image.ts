import { Container, ContainerOptions } from "./Container";
import { Element } from "./Element";
import { getBitmap } from "../helpers/Image";
import { AssetManager } from "../helpers/AssetManager";
import { ExactPosition } from "./Interfaces";
import { AtlasImage } from "../helpers/AtlasImage";

type ImageOptions = ContainerOptions<string | [string, string]>;

export class Image extends Container {
    constructor(
        asset_manager: AssetManager,
        options: ImageOptions, 
        children: Element[] = []
    ) {
        let img: AtlasImage;
        if (options.background) {
            img = asset_manager.getUniversalImage(options.background);

            if (!options.size) {
                options.size = {
                    width: img.frame.frame.w / 2,
                    height: img.frame.frame.h / 2,
                }
            }
        }

        if (options.backgroundOver) {
            options.on_rollover = () => this.initImage(
                asset_manager.getUniversalImage(options.backgroundOver), 
                options.position
            );
            options.on_rollout = () => this.initImage(
                asset_manager.getUniversalImage(options.background), 
                options.position
            );
        }

        super(
            {
                ...options, 
                background: null,
                backgroundOver: null
            }, 
            children
        );

        if (img) {
            this.initImage(img, options.position)
        }
    }

    private initImage(background: AtlasImage, position: ExactPosition | null): void {
        const bitmap = getBitmap(
            background,
            this.renderObject.getBounds()?.width, 
            this.renderObject.getBounds()?.height
        );
        
        bitmap.name = 'image_background';
        if (position) {
            bitmap.x = position.x / background.frame.frame.w;
            bitmap.y = position.y / background.frame.frame.h;
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