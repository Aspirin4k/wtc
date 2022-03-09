import {ControllerInterface} from "../SceneInterface";
import {SceneManager} from "../SceneManager";
import { ExactPosition } from '../../ui/Interfaces';
import { Container } from '../../ui/Container';

export class Controller implements ControllerInterface {
    private scene_manager: SceneManager;
    private container: Container;

    constructor(scene_manager: SceneManager, container: Container) {
        this.scene_manager = scene_manager;
        this.container = container;
    }

    public handleClick(position: ExactPosition): void {
        this.container.onClick(position);
    }

    public handleKeyDown(key: string): void {
    }
}
