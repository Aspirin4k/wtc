import { Graphics, Shape, Stage, TickerEvent, Tween } from "createjs-module";
import { Effect } from "../ScreenStateInterface";

export class ScreenAnimation {
    private readonly ANIMATION_DURATION = 500;

    private cancelCurrent: () => void = null;

    public isAnimating(): boolean {
        return !!this.cancelCurrent;
    }

    public end(): void {
        if (!this.cancelCurrent) {
            return;
        }

        this.cancelCurrent();
        this.cancelCurrent = null;
    }

    public runAnimation(effect: Effect | null, target: Stage): Promise<void> {
        const [cancel, promise] = this.getAnimationCallback(effect)(target);
        this.cancelCurrent = cancel;
        
        return promise
            .then(() => {
                this.cancelCurrent = null;
                return Promise.resolve();
            });
    }

    private getAnimationCallback(effect: Effect | null): (target: Stage) => [() => void | null, Promise<void>] {
        switch (effect) {
            case 'fade-in':
                return this.fadeIn.bind(this);
            case 'fade-in-gradient-radial':
                return this.fadeInGradientRadial.bind(this);
            case 'fade-out':
                return this.fadeOut.bind(this);
            default:
                return () => [null, Promise.resolve()];
        }
    }

    private fadeInGradientRadial(target: Stage): [() => void, Promise<void>] {
        const targetRadius = target.getBounds().width;
        const step = targetRadius / this.ANIMATION_DURATION;
        const shape = new Shape();
        target.addChild(shape);

        const promise = new Promise<void>((resolve) => {
            let radius = 1;
            shape.on('tick', (event: TickerEvent) => {
                if (radius > targetRadius * 1.5) {
                    shape.removeAllEventListeners();
                    target.removeChild(shape);
                    return resolve();
                }

                shape.graphics
                    .clear()
                    .beginRadialGradientFill(
                        ['rgba(0, 0, 0, 0)', '#000'],
                        [0, 1],
                        target.getBounds().width / 2,
                        target.getBounds().height / 2,
                        Math.max(0, radius - target.getBounds().width / 2),
                        target.getBounds().width / 2,
                        target.getBounds().height / 2,
                        radius
                    )
                    .drawRect(0, 0, target.getBounds().width, target.getBounds().height);

                radius += event.delta * step;
            });
        })
        
        return [
            () => {
                shape.removeAllEventListeners();
                target.removeChild(shape);
            }, 
            promise
        ];
    }

    private getFadeCallback(start: number, end: number): (target: Stage) => [() => void, Promise<void>] {
        return (target: Stage) => {
            let tween: Tween;
            const promise = new Promise<void>((resolve) => {
                const shape = this.createBlackLayer(target);
                shape.alpha = start;
        
                tween = Tween
                    .get(shape)
                    .to({alpha: end}, this.ANIMATION_DURATION)
                    .wait(100)
                    .call(() => {
                        target.removeChild(shape);
                        resolve();
                    });
            })

            return [() => tween.setPosition(tween.duration, 1), promise];
        }
    }

    private createBlackLayer(target: Stage): Shape {
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

        return shape;
    }

    private fadeIn(target: Stage): [() => void, Promise<void>] {
        return this.getFadeCallback(1, 0)(target);
    }

    private fadeOut(target: Stage): [() => void, Promise<void>] {
        return this.getFadeCallback(0, 1)(target);
    }
}