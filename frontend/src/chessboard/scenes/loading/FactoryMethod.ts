import { SceneInterface } from "../SceneInterface"
import { Controller } from "./Controller"
import { Renderer } from "./Renderer"
import { ResourceLoader } from "./ResourceLoader"

export const createInstance = (canvas: HTMLCanvasElement): SceneInterface => {
    return {
        controller: new Controller(),
        loader: new ResourceLoader(),
        renderer: new Renderer(canvas)
    }
}