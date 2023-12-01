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
        battler: '/character/ushiromia_battler/ub_serious_a3.png',

        b_different_space_2d: '/background/metaworld/different_space_2d.bmp',
        b_different_space_1a: '/background/metaworld/different_space_1a.bmp',

        ui_menu: '/ui/menu.png',
        ui_chapter_select: '/ui/chapter-select.png',
        ui_button: '/ui/Button.png',
        ui_button_selected: '/ui/Button_selected.png',
        ui_button_wide: '/ui/ButtonWide.png',
        ui_button_wide_selected: '/ui/ButtonWide_selected.png',
        ui_button_culprit: '/ui/ButtonCulprit.png',
        ui_button_culprit_selected: '/ui/ButtonCulprit_selected.png',
        ui_flowers: '/ui/hana_back.png',
        ui_label_select_culprit: '/ui/LabelSelectCulprit.png',

        ui_portrait_battler: '/ui/portrait/PortraitBattler.png',
        ui_portrait_battler_selected: '/ui/portrait/PortraitBattler_selected.png',
        ui_portrait_eva: '/ui/portrait/PortraitEva.png',
        ui_portrait_eva_selected: '/ui/portrait/PortraitEva_selected.png',
        ui_portrait_genji: '/ui/portrait/PortraitGenji.png',
        ui_portrait_genji_selected: '/ui/portrait/PortraitGenji_selected.png',
        ui_portrait_george: '/ui/portrait/PortraitGeorge.png',
        ui_portrait_george_selected: '/ui/portrait/PortraitGeorge_selected.png',
        ui_portrait_gohda: '/ui/portrait/PortraitGohda.png',
        ui_portrait_gohda_selected: '/ui/portrait/PortraitGohda_selected.png',
        ui_portrait_hideyoshi: '/ui/portrait/PortraitHideyoshi.png',
        ui_portrait_hideyoshi_selected: '/ui/portrait/PortraitHideyoshi_selected.png',
        ui_portrait_jessica: '/ui/portrait/PortraitJessica.png',
        ui_portrait_jessica_selected: '/ui/portrait/PortraitJessica_selected.png',
        ui_portrait_kanon: '/ui/portrait/PortraitKanon.png',
        ui_portrait_kanon_selected: '/ui/portrait/PortraitKanon_selected.png',
        ui_portrait_krauss: '/ui/portrait/PortraitKrauss.png',
        ui_portrait_krauss_selected: '/ui/portrait/PortraitKrauss_selected.png',
        ui_portrait_kumasawa: '/ui/portrait/PortraitKumasawa.png',
        ui_portrait_kumasawa_selected: '/ui/portrait/PortraitKumasawa_selected.png',
        ui_portrait_kyrie: '/ui/portrait/PortraitKyrie.png',
        ui_portrait_kyrie_selected: '/ui/portrait/PortraitKyrie_selected.png',
        ui_portrait_maria: '/ui/portrait/PortraitMaria.png',
        ui_portrait_maria_selected: '/ui/portrait/PortraitMaria_selected.png',
        ui_portrait_nanjo: '/ui/portrait/PortraitNanjo.png',
        ui_portrait_nanjo_selected: '/ui/portrait/PortraitNanjo_selected.png',
        ui_portrait_natsuhi: '/ui/portrait/PortraitNatsuhi.png',
        ui_portrait_natsuhi_selected: '/ui/portrait/PortraitNatsuhi_selected.png',
        ui_portrait_rosa: '/ui/portrait/PortraitRosa.png',
        ui_portrait_rosa_selected: '/ui/portrait/PortraitRosa_selected.png',
        ui_portrait_rudolf: '/ui/portrait/PortraitRudolf.png',
        ui_portrait_rudolf_selected: '/ui/portrait/PortraitRudolf_selected.png',
        ui_portrait_shannon: '/ui/portrait/PortraitShannon.png',
        ui_portrait_shannon_selected: '/ui/portrait/PortraitShannon_selected.png',
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