import {ResourceLoaderInterface} from "../SceneInterface";

export class ResourceLoader implements ResourceLoaderInterface {
    public getAssetsCount(): Promise<number> {
        return Promise.resolve(0);
    }

    public load(): Promise<void> {
        return Promise.resolve();
    }
}
