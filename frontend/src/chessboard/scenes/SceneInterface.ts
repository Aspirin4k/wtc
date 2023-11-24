import { Stage } from 'createjs-module';

import { SceneManager } from './SceneManager';
import { LoadingStateInteface } from './loading/Scene';

export interface SceneInterface {
    tick: () => void,

    getAssetsCount: () => Promise<number>,
    load: (state: LoadingStateInteface) => Promise<void>,

    initialize: (scene_manager: SceneManager, stage: Stage) => void,

    handleKeyDown: (key: string) => void,
}