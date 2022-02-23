import {Controller} from "./Controller";
import {Renderer} from "./Renderer";
import {ResourceLoader} from "./ResourceLoader";
import {SceneInterface} from "../SceneInterface";
import {SceneManager} from "../SceneManager";

export const createInstance = (scene_manager: SceneManager): SceneInterface => {
    const controller = new Controller(scene_manager);
    const renderer = new Renderer();
    const loader = new ResourceLoader();

    return {
        controller,
        loader,
        renderer,
    }
}
