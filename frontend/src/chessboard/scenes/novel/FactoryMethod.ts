import {SceneInterface} from "../SceneInterface";
import {Controller} from "./Controller";
import {State} from "./State";
import {AssetManager} from "../../helpers/AssetManager";
import {Renderer} from "./Renderer";
import {RenderTokenCalculator} from "./text/RenderTokenCalculator";
import {ResourceLoader} from "./ResourceLoader";
import {AssetResolver} from "../../helpers/AssetResolver";

export const createInstance = (asset_manager: AssetManager, asset_resolver: AssetResolver): SceneInterface => {
    const state = new State(asset_manager);
    const controller = new Controller(state);
    const text_render_calculator = new RenderTokenCalculator();
    const renderer = new Renderer(state, asset_manager, text_render_calculator);
    const loader = new ResourceLoader(asset_manager, asset_resolver);

    return {
        renderer,
        controller,
        loader
    }
}
