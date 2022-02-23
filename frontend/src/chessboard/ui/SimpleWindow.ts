import {Position, Size} from "./Interfaces";

export class SimpleWindow {
    private position: Position;
    private size: Size;

    constructor(position: Position, size: Size) {
        this.position = position;
        this.size = size;
    }

    public render(context: CanvasRenderingContext2D): void {

    }
}
