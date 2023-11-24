import { LoadingStateInteface } from "../scenes/loading/Scene";
import { AssetManager } from "./AssetManager";
import { AssetResolver } from "./AssetResolver";

interface Resources {
    [resName: string]: string,
}

export class AssetLoader {
    private readonly asset_manager: AssetManager;
    private readonly asset_resolver: AssetResolver;

    constructor(asset_manager: AssetManager, asset_resolver: AssetResolver) {
        this.asset_manager = asset_manager;
        this.asset_resolver = asset_resolver;
    }

    public createLoaderPromise(
        resources_images: Resources, 
        resources_audio: Resources, 
        loading_state: LoadingStateInteface = null
    ): Promise<void> {
        return new Promise((resolve) => {
            Object.keys(resources_images).forEach((short_name) => {
                resources_images[short_name] = this.asset_resolver.getResource(resources_images[short_name]);
            })
            const images_session_id = this.asset_manager.loadImages(
                resources_images, 
                loading_state && (() => loading_state.increment())
            );

            Object.keys(resources_audio).forEach((short_name) => {
                resources_audio[short_name] = this.asset_resolver.getAudio(resources_audio[short_name]);
            })
            const sounds_session_id = this.asset_manager.loadSound(
                resources_audio, 
                loading_state && (() => loading_state.increment())
            );

            this.asset_manager.onLoad(resolve, images_session_id, sounds_session_id);
        });
    }
};