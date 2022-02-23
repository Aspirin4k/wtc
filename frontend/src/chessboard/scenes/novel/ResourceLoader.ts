import {ResourceLoaderInterface} from "../SceneInterface";

import twilight from "../../classic/twilight/5-6_twilight.json";
import {AssetResolver} from "../../helpers/AssetResolver";
import {AssetManager} from "../../helpers/AssetManager";

export class ResourceLoader implements ResourceLoaderInterface {
    private asset_resolver: AssetResolver;
    private asset_manager: AssetManager;

    constructor(asset_manager: AssetManager, asset_resolver: AssetResolver) {
        this.asset_manager = asset_manager;
        this.asset_resolver = asset_resolver;
    }

    public load(): Promise<void> {
        return new Promise((resolve) => {
            const resources_images = twilight.resources.images;
            Object.keys(resources_images).forEach((short_name) => {
                resources_images[short_name] = this.asset_resolver.getResource(resources_images[short_name]);
            })
            const images_session_id = this.asset_manager.loadImages(resources_images);

            const resources_audio = twilight.resources.audio;
            Object.keys(resources_audio).forEach((short_name) => {
                resources_audio[short_name] = this.asset_resolver.getAudio(resources_audio[short_name]);
            })
            const sounds_session_id = this.asset_manager.loadSound(resources_audio);

            this.asset_manager.onLoad(resolve, images_session_id, sounds_session_id);
        })
    }
}
