import {getStaticURL} from "../../utils/static";
import {LoggerFactory} from "../../logger/LoggerFactory";
import { AtlasImage } from "./AtlasImage";

interface Listener {
    callback: () => void,
    sessions: number[],
}

type AtlasMetadata = {
    frames: {
        [imageName: string]: AtlasFrame,
    }
}

export type AtlasFrame = {
    frame: {
        x: number,
        y: number,
        w: number,
        h: number
    },
}

class AssetManager {
    private images: {[key: string]: HTMLImageElement} = {};
    private atlases: {[key: string]: [HTMLImageElement, AtlasMetadata]} = {};
    private audio: {[key: string]: HTMLAudioElement} = {};
    private event_listeners: Listener[] = [];

    private assets_load_sessions = {};

    public loadAtlases(urls: { [short_name: string]: string}, onSingleLoad?: () => void): number {
        const session_id = this.generateSessionID();
        this.initiateSession(session_id, Object.keys(urls).length);

        Object.keys(urls).forEach((short_name) => {
            if (this.atlases[short_name]) {
                this.assets_load_sessions[session_id].current_assets_loaded++;
                onSingleLoad && onSingleLoad();
                if (this.isSessionCompleted(session_id)) {
                    this.notifyListeners(session_id);
                }
                return;
            }

            Promise.all([
                this.loadImage(short_name, urls[short_name]),
                new Promise((resolve) => {
                    const atlasUrl = urls[short_name];
                    const jsonUrl = atlasUrl.substring(0, atlasUrl.lastIndexOf('.')) + '.json';
                    return fetch(getStaticURL(jsonUrl)).then((response) => {
                        return response.json().then((atlasMetadata) => {
                            return resolve(atlasMetadata);
                        });
                    });
                })
            ])
                .then((results) => {
                    const [image, metadata] = results;
                    this.atlases[short_name] = [image, metadata as AtlasMetadata];
                    this.assets_load_sessions[session_id].current_assets_loaded++;
                    onSingleLoad && onSingleLoad();
                    if (this.isSessionCompleted(session_id)) {
                        this.notifyListeners(session_id);
                    }
                })
        });

        return session_id;
    }

    public loadImages(urls: { [short_name: string]: string }, onSingleLoad?: () => void): number {
        const session_id = this.generateSessionID();
        this.initiateSession(session_id, Object.keys(urls).length);

        Object.keys(urls).forEach((short_name) => {
            if (this.images[short_name]) {
                this.assets_load_sessions[session_id].current_assets_loaded++;
                onSingleLoad && onSingleLoad();
                if (this.isSessionCompleted(session_id)) {
                    this.notifyListeners(session_id);
                }
                return;
            }

            this.loadImage(short_name, urls[short_name])
                .then((image) => {
                    this.images[short_name] = image;
                    this.assets_load_sessions[session_id].current_assets_loaded++;
                    onSingleLoad && onSingleLoad();
                    if (this.isSessionCompleted(session_id)) {
                        this.notifyListeners(session_id);
                    }
                })
        })

        return session_id;
    }

    private loadImage(short_name: string, image_url: string): Promise<HTMLImageElement> {
        return new Promise((resolve) => {
            const image = new Image();

            image.onload = () => {
                LoggerFactory.getLogger().info('Loaded image: ' + short_name)
                resolve(image);
            }
            image.onerror = () => {
                LoggerFactory.getLogger().error('Failed to load: ' + short_name)
                throw new Error('Failed to load: ' + short_name);
            }

            image.src = getStaticURL(image_url);
        });
    }

    public loadSound(urls: { [short_name: string ]: string }, onSingleLoad?: () => void): number {
        const session_id = this.generateSessionID();
        this.initiateSession(session_id, Object.keys(urls).length);

        Object.keys(urls).forEach((short_name) => {
            if (this.audio[short_name]) {
                this.assets_load_sessions[session_id].current_assets_loaded++;
                onSingleLoad && onSingleLoad();
                if (this.isSessionCompleted(session_id)) {
                    this.notifyListeners(session_id);
                }
                return;
            }

            const audio = new Audio(getStaticURL(urls[short_name]));

            audio.addEventListener('canplaythrough', () => {
                this.assets_load_sessions[session_id].current_assets_loaded++;
                onSingleLoad && onSingleLoad();
                if (this.isSessionCompleted(session_id)) {
                    this.notifyListeners(session_id);
                }
            });

            this.audio[short_name] = audio;
        })

        return session_id;
    }

    public loadFont(urls: { [font_name: string]: string }, onSingleLoad?: () => void): number {
        const session_id = this.generateSessionID();
        this.initiateSession(session_id, Object.keys(urls).length);

        Object.keys(urls).forEach((font_name) => {
            const font = new FontFace(font_name, `url(${getStaticURL(urls[font_name])})`);

            font.load().then(() => {
                this.assets_load_sessions[session_id].current_assets_loaded++;
                onSingleLoad && onSingleLoad();
                if (this.isSessionCompleted(session_id)) {
                    this.notifyListeners(session_id);
                }
                // @ts-ignore
                document.fonts.add(font);
            })
        })

        return session_id;
    }

    private generateSessionID(): number {
        return Math.floor(Math.random() * Number.MAX_VALUE);
    }

    private initiateSession(session_id: number, assets_to_load_count: number) {
        this.assets_load_sessions[session_id] = {};
        this.assets_load_sessions[session_id].total_assets_to_load = assets_to_load_count;
        this.assets_load_sessions[session_id].current_assets_loaded = 0;
    }

    private isSessionCompleted(session_id: number): boolean {
        return this.assets_load_sessions[session_id].current_assets_loaded
            === this.assets_load_sessions[session_id].total_assets_to_load;
    }

    private notifyListeners(session_id: number) {
        this.event_listeners = this.event_listeners.filter((listener) => {
            if (!listener.sessions.includes(session_id)) {
                return true;
            }

            listener.sessions.splice(listener.sessions.indexOf(session_id), 1);
            if (listener.sessions.length) {
                return true;
            }

            listener.callback();
            return false;
        });
    }

    public getUniversalImage(url: string | [string, string]): AtlasImage {
        if (Array.isArray(url)) {
            return this.getAtlasImage(url[0], url[1]);
        }

        const rawImg = this.getImage(url);
        return new AtlasImage(
            rawImg, 
            {
                frame: {x: 0, y: 0, w: rawImg.width, h: rawImg.height},
            }
        );
    }

    public getImage(url: string): HTMLImageElement {
        if (!this.images[url]) {
            throw new Error("Has no image asset for " + url);
        }

        return this.images[url];
    }

    public getAtlasImage(atlas_url: string, image: string) {
        if (!this.atlases[atlas_url]) {
            throw new Error("Has no atlas asset for " + atlas_url);
        }

        const [atlas, metadata] = this.atlases[atlas_url];
        if (!metadata.frames[image]) {
            throw new Error("Atlas " + atlas_url + " doesn't contain image " + image);
        }

        return new AtlasImage(atlas, metadata.frames[image]);
    }

    public getAudio(url: string): HTMLAudioElement {
        return this.audio[url];
    }

    public onLoad(callback: () => void, ...sessions: number[]): void {
        if (!sessions.length) {
            throw new Error('At least 1 session_id must be specified');
        }

        const actual_sessions = [];
        sessions.forEach((session_id) => {
            if (!this.assets_load_sessions[session_id]) {
                throw new Error('Has no session ' + session_id);
            }

            if (!this.isSessionCompleted(session_id)) {
                actual_sessions.push(session_id);
            }
        })

        if (!actual_sessions.length) {
            callback();
        } else {
            this.event_listeners.push({
                callback,
                sessions: actual_sessions,
            })
        }
    }
}

export { AssetManager }