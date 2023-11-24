import React, {Component, RefObject} from "react";
import { Stage } from 'createjs-module';

import {CLASSIC_SCREEN_HEIGHT, CLASSIC_SCREEN_WIDTH} from "./scenes/novel/Scene";
import {SceneManager} from "./scenes/SceneManager";

interface ChessboardProps {

}

interface ChessboardState {

}

class Chessboard extends Component<ChessboardProps, ChessboardState> {
    private readonly canvas: RefObject<HTMLCanvasElement>;
    private stage: Stage;

    private readonly scene_manager: SceneManager;

    constructor(props: ChessboardProps) {
        super(props);

        this.canvas = React.createRef();

        this.scene_manager = new SceneManager();
    }

    componentDidMount() {
        this.stage = new Stage('canvas');
        this.scene_manager.register(this.stage);
    }

    componentWillUnmount() {
        this.scene_manager.unregister();
        this.stage.enableMouseOver(-1);
        this.stage.enableDOMEvents(false);
        this.stage.removeAllEventListeners();
        this.stage.removeAllChildren();
        this.stage.canvas = null;
        this.stage = null;
    }

    render() {
        return <canvas
            id='canvas'
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