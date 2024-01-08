import { Container, DisplayObject, Stage } from "createjs-module";

export const removeAllEventListeners = (object: DisplayObject) => {
    if (object instanceof Container) {
        object.children.forEach((child) => {
            removeAllEventListeners(child);
        })
    }

    object.removeAllEventListeners();
};