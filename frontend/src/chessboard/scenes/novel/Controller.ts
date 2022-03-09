import {State} from "./State";
import {ControllerInterface} from "../SceneInterface";
import { ExactPosition } from '../../ui/Interfaces';

const KEY_ARROW_RIGHT = 'ArrowRight';
const KEY_ARROW_LEFT = 'ArrowLeft';
const KEY_ENTER = 'Enter';

class Controller implements ControllerInterface {
    private state: State;

    public constructor(state: State) {
        this.state = state;

        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleClick(position: ExactPosition) {
        this.state.proceedNovel();
    }

    handleKeyDown(key: string): void {
        switch (key) {
            case KEY_ENTER:
            case KEY_ARROW_RIGHT:
                this.state.proceedNovel();
                break;
            case KEY_ARROW_LEFT:
                this.state.revertNovel();
                break;
        }
    }
}

export { Controller }