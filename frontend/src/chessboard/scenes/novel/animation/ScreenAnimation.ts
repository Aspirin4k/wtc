import { AlphaMaskFilter, Container, Filter, Graphics, Rectangle, Shape, Stage, TickerEvent, Tween } from "createjs-module";
import { Effect } from "../ScreenStateInterface";

type LinearGradientPosition = {
    x?: 'left' | 'right',
    y?: 'top' | 'bottom',
}

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

    public runAnimation(effect: Effect | null, target: Container): Promise<void> {
        const [cancel, promise] = this.getAnimationCallback(effect)(target);
        this.cancelCurrent = cancel;
        
        return promise
            .then(() => {
                this.cancelCurrent = null;
                return Promise.resolve();
            });
    }

    private getAnimationCallback(effect: Effect | null): (target: Container) => [() => void | null, Promise<void>] {
        switch (effect) {
            case 'fade-in':
                return this.fadeIn.bind(this);
            case 'gradient-right':
                return (target: Container) => this.animateAlphaMask(target, this.animateLinearGradient({x: 'left'}));
            case 'gradient-left':
                return (target: Container) => this.animateAlphaMask(target, this.animateLinearGradient({x: 'right'}));
            case 'gradient-top':
                return (target: Container) => this.animateAlphaMask(target, this.animateLinearGradient({y: 'bottom'}));
            case 'gradient-bottom':
                return (target: Container) => this.animateAlphaMask(target, this.animateLinearGradient({y: 'top'}));
            case 'gradient-top-left':
                return (target: Container) => this.animateAlphaMask(target, this.animateLinearGradient({x: 'right', y: 'bottom'}));
            case 'gradient-top-right':
                return (target: Container) => this.animateAlphaMask(target, this.animateLinearGradient({x: 'left', y: 'bottom'}));
            case 'gradient-bottom-left':
                return (target: Container) => this.animateAlphaMask(target, this.animateLinearGradient({x: 'right', y: 'top'}));
            case 'gradient-bottom-right':
                return (target: Container) => this.animateAlphaMask(target, this.animateLinearGradient({x: 'left', y: 'top'}));
            case 'gradient-radial':
                return (target: Container) => this.animateAlphaMask(target, this.animateGradientRadial.bind(this));
            default:
                return () => [null, Promise.resolve()];
        }
    }

    private animateAlphaMask(
        target: Container,
        drawCallback: (state: any, graphics: Graphics, targetBounds: Rectangle, delta: number) => any
    ): [() => void, Promise<void>] {
        if (null === target.filters) {
            target.filters = [];
        }

        const mask = new Shape();
        let maskFilter: Filter;
        let animationTickHandler;
        let state = {};
        const promise = new Promise<void>((resolve) => {
            animationTickHandler = target.on('tick', (event: TickerEvent) => {
                // debugger;
                target.filters.filter((filter) => filter !== maskFilter);

                state = drawCallback(state, mask.graphics, target.getBounds(), event.delta);
                if (!state) {
                    target.removeEventListener('tick', animationTickHandler);
                    return resolve();
                }

                mask.cache(0, 0, target.getBounds().width, target.getBounds().height);
                // @ts-ignore
                maskFilter = new AlphaMaskFilter(mask.cacheCanvas);
                target.filters.push(maskFilter);
                target.cache(0, 0, target.getBounds().width, target.getBounds().height);
            });
        });

        return [
            () => {
                target.removeEventListener('tick', animationTickHandler);
                target.filters.filter((filter) => filter !== maskFilter);
            }, 
            promise
        ];
    }

    private animateGradientRadial(state: any, graphics: Graphics, targetBounds: Rectangle, delta: number): any {
        const targetRadius = targetBounds.width;
        const radius = state.radius || 1;

        if (radius > targetRadius * 1.5) {
            return false;
        }

        const step = targetRadius / this.ANIMATION_DURATION;
        graphics
            .clear()
            .beginRadialGradientFill(
                ['rgba(0, 0, 0, 0)', '#000'],
                [0, 1],
                targetBounds.width / 2,
                targetBounds.height / 2,
                Math.max(0, radius - targetBounds.width / 2),
                targetBounds.width / 2,
                targetBounds.height / 2,
                radius
            )
            .drawRect(0, 0, targetBounds.width, targetBounds.height);

        return {
            ...state,
            radius: radius + delta * step,
        };
    }

    private animateLinearGradient = (startPosition: LinearGradientPosition) => 
        (state: any, graphics: Graphics, targetBounds: Rectangle, delta: number): any => {
            const targetLength = targetBounds.width;
            const length = state.length || 1;

            if (length > targetLength * 1.5) {
                return false;
            }

            const step = targetLength / this.ANIMATION_DURATION;

            graphics
                .clear()
                .beginLinearGradientFill(
                    ['rgba(0, 0, 0, 0)', '#000'],
                    [0, 1],
                    startPosition.x
                        ? (startPosition.x === 'left' ? 0 : targetBounds.width)
                        : targetBounds.height / 2,
                    startPosition.y
                        ? (startPosition.y === 'top' ? 0 : targetBounds.height)
                        : targetBounds.width / 2,
                    startPosition.x
                        ? (startPosition.x === 'left' ? length : targetBounds.width - length)
                        : targetBounds.height / 2,
                    startPosition.y
                        ? (startPosition.y === 'top' ? length : targetBounds.height - length)
                        : targetBounds.width / 2,
                )
                .drawRect(0, 0, targetBounds.width, targetBounds.height);

            return {
                ...state,
                length: length + delta * step,
            };
        }

    private getFadeCallback(start: number, end: number): (target: Container) => [() => void, Promise<void>] {
        return (target: Stage) => {
            let tween: Tween;
            const promise = new Promise<void>((resolve) => {
                target.alpha = start;
        
                tween = Tween
                    .get(target)
                    .to({alpha: end}, this.ANIMATION_DURATION)
                    .wait(100)
                    .call(() => {
                        target.removeChild(target);
                        resolve();
                    });
            })

            return [() => tween.setPosition(tween.duration, 1), promise];
        }
    }

    private fadeIn(target: Container): [() => void, Promise<void>] {
        return this.getFadeCallback(1, 0)(target);
    }
}