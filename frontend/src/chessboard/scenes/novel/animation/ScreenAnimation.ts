import { Shape, Stage, Tween } from "createjs-module";
import { Effect } from "../ScreenStateInterface";

export class ScreenAnimation {
    private current_tween: Tween = null;

    public isAnimating(): boolean {
        return !!this.current_tween;
    }

    public end(): void {
        if (!this.current_tween) {
            return;
        }

        this.current_tween.setPosition(this.current_tween.duration, 1)
    }

    public runAnimation(effect: Effect | null, target: Stage): Promise<void> {
        const [tween, promise] = this.getAnimationCallback(effect)(target);
        this.current_tween = tween;
        
        return promise
            .then(() => {
                this.current_tween = null;
                return Promise.resolve();
            });
    }

    private getAnimationCallback(effect: Effect | null): (target: Stage) => [Tween | null, Promise<void>] {
        switch (effect) {
            case 'fade-in':
                return this.fadeIn;
            case 'fade-out':
                return this.fadeOut;
            default:
                return () => [null, Promise.resolve()];
        }
    }

    private fadeIn(target: Stage): [Tween, Promise<void>] {
        let tween;
        const promise = new Promise<void>((resolve) => {
            const shape = new Shape();
            shape.graphics
                .beginFill('#000')
                .drawRect(
                    0, 
                    0, 
                    target.getBounds().width, 
                    target.getBounds()?.height
                )
                .endFill()
            target.addChild(shape);
    
            tween = Tween
                .get(shape)
                .to({alpha: 0}, 500)
                .wait(100)
                .call(() => {
                    target.removeChild(shape);
                    resolve();
                });
        })

        return [tween, promise];
    }

    private fadeOut(target: Stage): [Tween, Promise<void>] {
        let tween;
        const promise = new Promise<void>((resolve) => {
            const shape = new Shape();
            shape.alpha = 0;
            shape.graphics
                .beginFill('#000')
                .drawRect(
                    0, 
                    0, 
                    target.getBounds().width, 
                    target.getBounds()?.height
                )
                .endFill()
            target.addChild(shape);
    
            tween = Tween
                .get(shape)
                .to({alpha: 1}, 500)
                .wait(100)
                .call(() => {
                    target.removeChild(shape);
                    resolve();
                });
        })
    
        return [tween, promise];
    }
}