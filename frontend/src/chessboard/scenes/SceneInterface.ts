import { Stage } from 'createjs-module';

import { SceneManager } from './SceneManager';
import { LoadingStateInteface } from './loading/Scene';

export interface SceneInterface {
    tick: (time: number) => void,

    getAssetsCount: () => Promise<number>,
    load: (state: LoadingStateInteface) => Promise<void>,

    preInitialize: (args: any) => void,
    initialize: (scene_manager: SceneManager, stage: Stage) => void,

    handleKeyDown: (key: string) => void,
}