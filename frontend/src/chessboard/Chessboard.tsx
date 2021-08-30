import React, {Component, RefObject} from "react";

import {AssetManager} from "./helpers/AssetManager";
import {AssetResolver} from "./helpers/AssetResolver";
import {RenderTokenCalculator} from "./novel/text/RenderTokenCalculator";

import twilight from "./classic/twilight/7_twilight.json";
import {State} from "./novel/State";
import {Controller} from "./novel/Controller";
import {CLASSIC_SCREEN_HEIGHT, CLASSIC_SCREEN_WIDTH, Renderer} from "./novel/Renderer";

const CHESSBOARD_MODE_CLASSIC = 1;

interface ChessboardProps {

}

interface ChessboardState {

}

class Chessboard extends Component<ChessboardProps, ChessboardState> {
    private readonly canvas: RefObject<HTMLCanvasElement>;
    private readonly asset_manager: AssetManager;
    private asset_resolver: AssetResolver;

    private controller: Controller;
    private renderer: Renderer;

    constructor(props: ChessboardProps) {
        super(props);

        this.canvas = React.createRef();
        this.asset_resolver = new AssetResolver(CHESSBOARD_MODE_CLASSIC);
        this.asset_manager = new AssetManager();
        const text_render_token_calculator = new RenderTokenCalculator();
        const game_state = new State(this.asset_manager);

        this.controller = new Controller(game_state);
        this.renderer = new Renderer(
            game_state,
            this.asset_manager,
            text_render_token_calculator
        );

        const resources_images = twilight.resources.images;
        Object.keys(resources_images).forEach((short_name) => {
            resources_images[short_name] = this.asset_resolver.getResource(resources_images[short_name]);
        })
        this.asset_manager.loadImages(resources_images);

        const resources_audio = twilight.resources.audio;
        Object.keys(resources_audio).forEach((short_name) => {
            resources_audio[short_name] = this.asset_resolver.getAudio(resources_audio[short_name]);
        })
        this.asset_manager.loadSound(resources_audio);
    }



    componentDidMount() {
        this.asset_manager.onLoad(() => {
            this.renderer.register(this.canvas.current);
            this.controller.register(this.canvas.current);
        })
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