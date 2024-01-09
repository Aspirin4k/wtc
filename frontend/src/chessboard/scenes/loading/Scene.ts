import { Shape, Stage } from "createjs-module";
import { SceneInterface } from "../SceneInterface";
import { SceneManager } from "../SceneManager";
import { Container } from "../../ui/Container";

export interface LoadingStateInteface {
    increment: () => void,
}

export class Scene implements SceneInterface, LoadingStateInteface {
    private readonly LOADING_BAR_WIDTH = 420;
    private readonly LOADING_BAR_HEIGHT = 36

    private readonly LOADING_CELL_HEIGHT = 20;
    private loading_cell_width: number = 0;

    private screenWidth: number = 0;
    private screenHeight: number = 0;
    
    private background: Shape;

    private maximum: number = 0;
    private current: number = 0;

    public tick(time: number): void {
    }

    public preInitialize(args: any): void {
    }

    public async getAssetsCount(): Promise<number> {
        return 0;
    }

    public async load(): Promise<void> {
    }

    public initialize(scene_manager: SceneManager, stage: Stage): void {
        this.background = new Shape();

        this.screenWidth = (stage.canvas as HTMLCanvasElement).width;
        this.screenHeight = (stage.canvas as HTMLCanvasElement).height;

        this.background
            .graphics
            .beginFill('black')
            .drawRect(0, 0, this.screenWidth, this.screenHeight)
            .setStrokeStyle(4)
            .beginStroke('#501b1b')
            .moveTo((this.screenWidth - this.LOADING_BAR_WIDTH) / 2, (this.screenHeight - this.LOADING_BAR_HEIGHT) / 2)
            .lineTo((this.screenWidth + this.LOADING_BAR_WIDTH) / 2, (this.screenHeight - this.LOADING_BAR_HEIGHT) / 2)
            .lineTo((this.screenWidth + this.LOADING_BAR_WIDTH) / 2, (this.screenHeight + this.LOADING_BAR_HEIGHT) / 2)
            .lineTo((this.screenWidth - this.LOADING_BAR_WIDTH) / 2, (this.screenHeight + this.LOADING_BAR_HEIGHT) / 2)
            .closePath();

        stage.addChild(this.background);
    }

    public getLoadingState(maximum: number): LoadingStateInteface {
        this.maximum = maximum;
        this.current = 0;

        this.loading_cell_width =  Math.floor(404 / maximum);

        return this;
    }

    public increment(): void {
        if (this.current >= this.maximum) {
            return;
        }

        this.background
            .graphics
            .beginFill('#501b1b')
            .drawRect(
                (this.screenWidth - this.LOADING_BAR_WIDTH) / 2 + 8 + this.current * this.loading_cell_width, 
                (this.screenHeight - this.LOADING_BAR_HEIGHT) / 2 + 8, 
                this.loading_cell_width, 
                this.LOADING_CELL_HEIGHT
            )

        this.current++;
    }

    handleKeyDown(key: string): void {
    }
}