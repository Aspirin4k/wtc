import { RenderingContext } from "../../helpers/RenderingContext";
import { Container } from "../../ui/Container";
import { Renderable } from "../../ui/RenderableInterface";
import { RendererInterface } from "../SceneInterface";
import { LoadingState } from "./LoadingState";

export class Renderer implements RendererInterface {
    private readonly canvas: HTMLCanvasElement;
    private readonly container: Renderable;
    private loading_bar: Container;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.container = new Container(
            {
                position: {
                    x: 0,
                    y: 0
                },
                size: {
                    width: canvas.width,
                    height: canvas.height
                },
                background: 'black'
            },
            [
                new Container(
                    {
                        auto_position: {
                            horizontal: 'center',
                            vertical: 'middle'
                        },
                        size: {
                            width: 420,
                            height: 36
                        },
                        background: 'yellow'
                    },
                    [
                        new Container(
                            {
                                auto_position: {
                                    horizontal: 'center',
                                    vertical: 'middle'
                                },
                                size: {
                                    width: 412,
                                    height: 28
                                },
                                background: 'black'
                            }
                        )
                    ]
                )
            ]
        )
    }

    renderGameFrame(rendering_context: RenderingContext, canvas: HTMLCanvasElement) {
        this.container.render(rendering_context);
        if (this.loading_bar) {
            this.loading_bar.render(rendering_context);
        }
    };

    public getLoadingState(maximum: number) {
        const loading_state = new LoadingState(maximum, {width: Math.floor(404 / maximum), height: 20});

        this.loading_bar = new Container(
            {
                position: {
                    x: 0,
                    y: 0
                },
                size: {
                    width: this.canvas.width,
                    height: this.canvas.height
                }
            },
            [
                new Container(
                    {
                        auto_position: {
                            horizontal: 'center',
                            vertical: 'middle'
                        },
                        size: {
                            width: 404,
                            height: 20
                        }
                    },
                    loading_state.getBars()
                )
            ]
        )

        return loading_state;
    }
}