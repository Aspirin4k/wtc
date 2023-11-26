import { Stage, Container as CreateJSContainer } from "createjs-module";
import { SceneInterface } from "../SceneInterface";
import { SceneManager } from "../SceneManager";
import { AssetLoader } from "../../helpers/AssetLoader";
import { LoadingStateInteface } from "../loading/Scene";
import { AssetManager } from "../../helpers/AssetManager";
import { InterfaceState } from "./InterfaceState";

export class Scene implements SceneInterface {
    private readonly IMAGES = {
        bernkastel: '/character/bernkastel/ber_evil_laugh_a2.png',
        b_different_space_2d: '/background/metaworld/different_space_2d.bmp',

        ui_menu: '/ui/menu.png',
        ui_chapter_select: '/ui/chapter-select.png',
        ui_button: '/ui/Button.png',
        ui_button_selected: '/ui/Button_selected.png',
        ui_button_wide: '/ui/ButtonWide.png',
        ui_button_wide_selected: '/ui/ButtonWide_selected.png',
        ui_flowers: '/ui/hana_back.png',
    };

    private readonly AUDIO = {
        main: '/bgm/0e_resurrectedreplayer.ogg',
    };

    private readonly FONTS = {
        'ITC Bookman Medium': '/font/BookmanStd-Medium.woff2',
        'ITC Bookman Light': '/font/BookmanStd-Light.woff2',
    }

    private readonly asset_loader: AssetLoader;
    private readonly asset_manager: AssetManager;
    
    private state: InterfaceState;

    constructor(asset_loader: AssetLoader, asset_manager: AssetManager) {
        this.asset_loader = asset_loader;
        this.asset_manager = asset_manager;
    }

    public preInitialize(args: any): void {
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
            this.FONTS,
            loadingState
        )
    }

    public initialize(scene_manager: SceneManager, stage: Stage): void {
        const screenWidth = (stage.canvas as HTMLCanvasElement).width;
        const screenHeight = (stage.canvas as HTMLCanvasElement).height;

        this.state = new InterfaceState(this.asset_manager, scene_manager, screenWidth, screenHeight);
        stage.children = this.state.getCurrentState();
    }

    handleKeyDown(key: string): void {
    }
}