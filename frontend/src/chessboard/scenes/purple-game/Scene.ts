import { Stage } from "createjs-module";
import { SceneInterface } from "../SceneInterface";
import { SceneManager } from "../SceneManager";
import { AssetLoader } from "../../helpers/AssetLoader";
import { LoadingStateInteface } from "../loading/Scene";
import { AssetManager } from "../../helpers/AssetManager";
import { Image } from "../../ui/Image";

export class Scene implements SceneInterface {
    private readonly IMAGES = {
        bernkastel: '/character/bernkastel/ber_evil_laugh_a2.png',
        b_different_space_2d: '/background/metaworld/different_space_2d.bmp',
        ui_menu: '/ui/menu.png',
        ui_chapter_select: '/ui/chapter-select.png',
    };

    private readonly AUDIO = {
        main: '/bgm/0e_resurrectedreplayer.ogg',
    };

    private readonly asset_loader: AssetLoader;
    private readonly asset_manager: AssetManager;

    constructor(asset_loader: AssetLoader, asset_manager: AssetManager) {
        this.asset_loader = asset_loader;
        this.asset_manager = asset_manager;
    }

    public tick(): void {
    }

    public async getAssetsCount(): Promise<number> {
        return Object.keys(this.IMAGES).length + Object.keys(this.AUDIO).length;
    }

    public async load(loadingState: LoadingStateInteface): Promise<void> {
        await this.asset_loader.createLoaderPromise(
            this.IMAGES,
            this.AUDIO,
            loadingState
        )
    }

    public initialize(scene_manager: SceneManager, stage: Stage): void {
        const {asset_manager} = this;

        const screenWidth = (stage.canvas as HTMLCanvasElement).width;
        const screenHeight = (stage.canvas as HTMLCanvasElement).height;

        const container = new Image(
            asset_manager,
            {
                position: {x: 0, y: 0},
                size: {width: screenWidth, height: screenHeight},
                background: 'b_different_space_2d',
            },
            [
                new Image(
                    asset_manager,
                    {
                        position: {x: 12, y: 130},
                        size: {width: 170, height: 190},
                        background: 'ui_menu',
                    }
                ),
                new Image(
                    asset_manager,
                    {
                        position: {x: 115, y: 0},
                        background: 'bernkastel',
                    }
                )
                // new Image(
                //     asset_manager,
                //     {
                //         position: {x: 230, y: 30},
                //         size: {width: 320, height: 420},
                //         background: 'ui_chapter_select',
                //     }
                // )
            ]
        );

        container.addToStage(stage);
    }

    handleKeyDown(key: string): void {
    }
}