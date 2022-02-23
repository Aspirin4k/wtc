import React, {Component, RefObject} from "react";

import {CLASSIC_SCREEN_HEIGHT, CLASSIC_SCREEN_WIDTH} from "./scenes/novel/Renderer";
import {SceneController} from "./scenes/SceneController";
import {SceneRenderer} from "./scenes/SceneRenderer";
import {SceneManager} from "./scenes/SceneManager";

interface ChessboardProps {

}

interface ChessboardState {

}

class Chessboard extends Component<ChessboardProps, ChessboardState> {
    private readonly canvas: RefObject<HTMLCanvasElement>;

    private readonly scene_manager: SceneManager;
    private controller: SceneController;
    private renderer: SceneRenderer;

    constructor(props: ChessboardProps) {
        super(props);

        this.canvas = React.createRef();

        this.scene_manager = new SceneManager();
        this.controller = new SceneController(this.scene_manager);
        this.renderer = new SceneRenderer(this.scene_manager);
    }

    componentDidMount() {
        this.scene_manager.initiate();
        this.renderer.register(this.canvas.current);
        this.controller.register(this.canvas.current);
    }

    componentWillUnmount() {
        this.renderer.unregister();
        this.controller.unregister(this.canvas.current);
    }

    render() {
        return <canvas
            style={{
                width: CLASSIC_SCREEN_WIDTH,
                height: CLASSIC_SCREEN_HEIGHT
            }}
            ref={this.canvas}
            height={CLASSIC_SCREEN_HEIGHT}
            width={CLASSIC_SCREEN_WIDTH}
        />;
    }
}

export { Chessboard }