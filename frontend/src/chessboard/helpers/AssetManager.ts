import {getStaticURL} from "../../utils/static";

class AssetManager {
    private images: {[key: string]: HTMLImageElement} = {};
    private audio: {[key: string]: HTMLAudioElement} = {};
    private event_listeners: (() => void)[] = [];

    private total_assets_to_load: number = 0;
    private current_assets_loaded: number = 0;

    public loadImages(urls: { [short_name: string]: string }): void {
        this.total_assets_to_load += Object.keys(urls).length;

        Object.keys(urls).forEach((short_name) => {
            const image = new Image();

            image.onload = () => {
                this.current_assets_loaded++;
                if (this.current_assets_loaded === this.total_assets_to_load) {
                    this.event_listeners.forEach((callback) => {
                        callback();
                    })
                    this.event_listeners = [];
                }
            }
            image.onerror = () => {
                console.log('Failed to load: ' + short_name);
            }

            image.src = getStaticURL(urls[short_name]);
            this.images[short_name] = image;
        })
    }

    public loadSound(urls: { [short_name: string ]: string }): void {
        this.total_assets_to_load += Object.keys(urls).length;

        Object.keys(urls).forEach((short_name) => {
            const audio = new Audio(getStaticURL(urls[short_name]));

            audio.addEventListener('canplaythrough', () => {
                this.current_assets_loaded++;
                if (this.current_assets_loaded === this.total_assets_to_load) {
                    this.event_listeners.forEach((callback) => {
                        callback();
                    })
                    this.event_listeners = [];
                }
            });

            audio.loop = true;
            this.audio[short_name] = audio;
        })
    }

    public getImage(url: string): HTMLImageElement {
        return this.images[url];
    }

    public getAudio(url: string): HTMLAudioElement {
        return this.audio[url];
    }

    public onLoad(callback: () => void): void {
        if (this.current_assets_loaded === this.total_assets_to_load) {
            callback();
        } else {
            this.event_listeners.push(callback);
        }
    }
}

export { AssetManager }