import {ResourceLoaderInterface} from "../SceneInterface";

import twilight from "../../classic/twilight/5-6_twilight.json";
import {AssetResolver} from "../../helpers/AssetResolver";
import {AssetManager} from "../../helpers/AssetManager";
import { LoadingState } from "../loading/LoadingState";

export class ResourceLoader implements ResourceLoaderInterface {
    private asset_resolver: AssetResolver;
    private asset_manager: AssetManager;

    constructor(asset_manager: AssetManager, asset_resolver: AssetResolver) {
        this.asset_manager = asset_manager;
        this.asset_resolver = asset_resolver;
    }

    public getAssetsCount(): Promise<number> {
        return Promise.resolve(
            Object.keys(twilight.resources.images).length
                + Object.keys(twilight.resources.audio).length
        )
    }

    public load(loading_state: LoadingState): Promise<void> {
        return new Promise((resolve) => {
            const resources_images = twilight.resources.images;
            Object.keys(resources_images).forEach((short_name) => {
                resources_images[short_name] = this.asset_resolver.getResource(resources_images[short_name]);
            })
            const images_session_id = this.asset_manager.loadImages(resources_images, () => loading_state.increment());

            const resources_audio = twilight.resources.audio;
            Object.keys(resources_audio).forEach((short_name) => {
                resources_audio[short_name] = this.asset_resolver.getAudio(resources_audio[short_name]);
            })
            const sounds_session_id = this.asset_manager.loadSound(resources_audio, () => loading_state.increment());

            this.asset_manager.onLoad(resolve, images_session_id, sounds_session_id);
        })
    }
}
