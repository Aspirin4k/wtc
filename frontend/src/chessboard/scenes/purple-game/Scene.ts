import { Stage } from "createjs-module";
import { SceneInterface } from "../SceneInterface";
import { SceneManager } from "../SceneManager";
import { AssetLoader } from "../../helpers/AssetLoader";
import { LoadingStateInteface } from "../loading/Scene";
import { AssetManager } from "../../helpers/AssetManager";
import { InterfaceState } from "./InterfaceState";
import { BGM } from "../novel/BGM";

export class Scene implements SceneInterface {
    private readonly ATLASES = {
        ui_portrait: '/ui/Portrait.png',
        ui_portrait_dead: '/ui/PortraitDead.png',
        ui_victim_portrait: '/ui/PortraitVictim.png',
        ui_element: '/ui/UI.png',
    };

    private readonly IMAGES = {
        bernkastel: '/character/bernkastel/ber_evil_laugh_a2.png',
        battler: '/character/ushiromia_battler/ub_serious_a3.png',

        purple_krauss: '/character/ushiromia_krauss/uk_serious_a2.png',
        purple_nanjo: '/character/nanji/nan_troubled_a3.png',
        purple_natsuhi: '/character/ushiromia_natsuhi/un_serious_a1.png',
        purple_jessica: '/character/ushiromia_jessica/uj_serious_a1.png',
        purple_george: '/character/ushiromia_george/ug_serious_a3.png',
        purple_battler: '/character/ushiromia_battler/ub_serious_a1.png',
        purple_maria: '/character/ushiromia_maria/um_evil_a2.png',
        purple_kumasawa: '/character/kumasawa/kum_serious_a1.png',
        purple_gohda: '/character/gohda/goh_troubled_a2.png',
        purple_kanon: '/character/kanon/kan_apathy_a2.png',
        purple_shannon: '/character/shannon/sha_serious_a3.png',

        b_different_space_2d: '/background/metaworld/different_space_2d.bmp',
        b_different_space_1a: '/background/metaworld/different_space_1a.bmp',

        ui_menu: '/ui/menu.png',
        ui_chapter_select: '/ui/chapter-select.png',
        ui_flowers: '/ui/hana_back.png',
    };

    private readonly AUDIO = {
        main: '/bgm/0e_resurrectedreplayer.ogg',

        page: '/system/page.wav',
        click01: '/system/mouse_click_01.wav',
        click07: '/system/mouse_click_07.wav',
    };

    private readonly FONTS = {
        'ITC Bookman Medium': '/font/BookmanStd-Medium.woff2',
        'ITC Bookman Light': '/font/BookmanStd-Light.woff2',
    }

    private readonly asset_loader: AssetLoader;
    private readonly asset_manager: AssetManager;
    private readonly bgm: BGM;
    
    private state: InterfaceState;

    constructor(asset_loader: AssetLoader, asset_manager: AssetManager, bgm: BGM) {
        this.asset_loader = asset_loader;
        this.asset_manager = asset_manager;
        this.bgm = bgm;
    }

    public preInitialize(args: any): void {
    }

    public tick(time: number): void {
    }

    public async getAssetsCount(): Promise<number> {
        return Object.keys(this.IMAGES).length 
            + Object.keys(this.AUDIO).length 
            + Object.keys(this.ATLASES).length
            + Object.keys(this.FONTS).length;
    }

    public async load(loadingState: LoadingStateInteface): Promise<void> {
        await this.asset_loader.createLoaderPromise(
            this.IMAGES,
            this.ATLASES,
            this.AUDIO,
            this.FONTS,
            loadingState
        )
    }

    public initialize(scene_manager: SceneManager, stage: Stage): void {
        const screenWidth = (stage.canvas as HTMLCanvasElement).width;
        const screenHeight = (stage.canvas as HTMLCanvasElement).height;

        this.state = new InterfaceState(this.asset_manager, scene_manager, screenWidth, screenHeight);
        const bgm = this.asset_manager.getAudio('main');
        this.bgm.play(bgm);

        stage.children = this.state.getCurrentState();
    }

    handleKeyDown(key: string): void {
    }
}