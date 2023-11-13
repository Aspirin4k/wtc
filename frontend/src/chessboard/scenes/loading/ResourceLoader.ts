import {ResourceLoaderInterface} from "../SceneInterface";

export class ResourceLoader implements ResourceLoaderInterface{
    getAssetsCount(): Promise<number> {
        return Promise.resolve(0);
    }

    public load(): Promise<void> {
        return Promise.resolve();
    }
}
