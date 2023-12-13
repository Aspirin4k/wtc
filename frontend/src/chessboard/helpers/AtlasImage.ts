import { AtlasFrame } from "./AssetManager";

export class AtlasImage {
    public readonly atlas: HTMLImageElement;
    public readonly frame: AtlasFrame;
    
    constructor(atlas: HTMLImageElement, frame: AtlasFrame) {
        this.atlas = atlas;
        this.frame = frame;
    }
}