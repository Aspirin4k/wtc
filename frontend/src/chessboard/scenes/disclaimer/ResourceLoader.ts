import {ResourceLoaderInterface} from "../SceneInterface";

export class ResourceLoader implements ResourceLoaderInterface{
    public load(): Promise<void> {
        return Promise.resolve();
    }
}
