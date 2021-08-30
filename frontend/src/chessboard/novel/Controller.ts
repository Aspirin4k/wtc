import {State} from "./State";

const KEY_ARROW_RIGHT = 'ArrowRight';
const KEY_ARROW_LEFT = 'ArrowLeft';
const KEY_ENTER = 'Enter';

class Controller {
    private state: State;

    public constructor(state: State) {
        this.state = state;

        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    public register(canvas: HTMLCanvasElement) {
        canvas.addEventListener('click', this.handleClick);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    public unregister(canvas: HTMLCanvasElement) {
        canvas.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleClick() {
        this.state.proceedNovel();
    }

    handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
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