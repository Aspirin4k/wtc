import { AlphaMaskFilter, Container, Filter, Graphics, Rectangle, Shape, Stage, TickerEvent, Tween } from "createjs-module";
import { Effect } from "../ScreenStateInterface";

type LinearGradientPosition = {
    x?: 'left' | 'right',
    y?: 'top' | 'bottom',
}

export class ScreenAnimation {
    private readonly ANIMATION_DURATION = 300;

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

    public runAnimation(effect: Effect | null, speed: number | null, target: Container): Promise<void> {
        const [cancel, promise] = this.getAnimationCallback(effect)(target, speed || this.ANIMATION_DURATION);
        this.cancelCurrent = cancel;
        
        return promise
            .then(() => {
                this.cancelCurrent = null;
                return Promise.resolve();
            });
    }

    private getAnimationCallback(effect: Effect | null): (target: Container, speed: number) => [() => void | null, Promise<void>] {
        switch (effect) {
            case 'shake-bottom':
                return this.animateShakeBottom.bind(this);
            case 'shake-top':
                return this.animateShakeTop.bind(this);
            case 'shake-left':
                return this.animateShakeLeft.bind(this);
            case 'shake-right':
                return this.animateShakeRight.bind(this);
            case 'fade-in':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateFadeIn.bind(this));
            case 'gradient-right':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateLinearGradient({x: 'left'}));
            case 'gradient-left':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateLinearGradient({x: 'right'}));
            case 'gradient-top':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateLinearGradient({y: 'bottom'}));
            case 'gradient-bottom':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateLinearGradient({y: 'top'}));
            case 'gradient-top-left':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateLinearGradient({x: 'right', y: 'bottom'}));
            case 'gradient-top-right':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateLinearGradient({x: 'left', y: 'bottom'}));
            case 'gradient-bottom-left':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateLinearGradient({x: 'right', y: 'top'}));
            case 'gradient-bottom-right':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateLinearGradient({x: 'left', y: 'top'}));
            case 'gradient-left-right':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateLinearGradientTear({x: 'right'}));
            case 'gradient-radial':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateGradientRadial.bind(this));
            case 'gradient-horizontal-outside':
                return (target: Container, speed: number) => this.animateAlphaMask(target, speed, this.animateLinearGradientHorizontalOutside.bind(this));
            default:
                return () => [null, Promise.resolve()];
        }
    }

    private animateShakeBottom(target: Container, speed: number): [() => void, Promise<void>] {
        return this.animateShake(target, speed, 0, 4);
    }

    private animateShakeTop(target: Container, speed: number): [() => void, Promise<void>] {
        return this.animateShake(target, speed, 0, -4);
    }

    private animateShakeLeft(target: Container, speed: number): [() => void, Promise<void>] {
        return this.animateShake(target, speed, -4, 0);
    }

    private animateShakeRight(target: Container, speed: number): [() => void, Promise<void>] {
        return this.animateShake(target, speed, 4, 0);
    }
    
    private animateShake(target: Container, speed: number, offsetX: number, offsetY: number): [() => void, Promise<void>] {
        const startY = target.y;
        const startX = target.x;

        let tween: Tween;
        const promise = new Promise<void>((resolve) => {
            tween = Tween
                .get(target)
                .to({y: startY + offsetY, x: startX + offsetX}, speed / 5)
                .to({y: startY, x: startX}, speed / 5)
                .call(resolve);
        });

        return [() => tween.setPosition(tween.duration, 1), promise];
    }

    private animateAlphaMask(
        target: Container,
        speed: number,
        drawCallback: (state: any, graphics: Graphics, targetBounds: Rectangle, delta: number, speed: number) => any
    ): [() => void, Promise<void>] {
        if (null === target.filters) {
            target.filters = [];
        }

        const mask = new Shape();
        let maskFilter: Filter;
        let animationTickHandler;
        let state = {};
        let isCanceled = false;
        const promise = new Promise<void>((resolve) => {
            animationTickHandler = target.on('tick', (event: TickerEvent) => {
                target.filters = target.filters.filter((filter) => filter !== maskFilter);

                state = drawCallback(state, mask.graphics, target.getBounds(), event.delta, speed);
                if (!state || isCanceled) {
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
                isCanceled = true;
            }, 
            promise
        ];
    }

    private animateGradientRadial(state: any, graphics: Graphics, targetBounds: Rectangle, delta: number, speed: number): any {
        const targetRadius = targetBounds.width;
        const radius = state.radius || 1;

        if (radius > targetRadius * 1.5) {
            return false;
        }

        const step = targetRadius / speed;
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
        (state: any, graphics: Graphics, targetBounds: Rectangle, delta: number, speed: number): any => {
            const targetLength = targetBounds.width;
            const length = state.length || 1;

            if (length > targetLength * 1.5) {
                return false;
            }

            const step = targetLength / speed;

            graphics.clear();
            this.renderLinearGradient(graphics, startPosition, targetBounds, length);
            graphics.drawRect(0, 0, targetBounds.width, targetBounds.height);

            return {
                ...state,
                length: length + delta * step,
            };
        }

    private animateLinearGradientTear = (start1Position: LinearGradientPosition) => 
        (state: any, graphics: Graphics, targetBounds: Rectangle, delta: number, speed: number): any => {
            const targetLength = targetBounds.width;
            const length = state.length || 1;

            if (length > targetLength * 1.5) {
                return false;
            }

            const start2Position: LinearGradientPosition = {
                x: !start1Position.x
                    ? undefined
                    : (start1Position.x === 'left' ? 'right' : 'left'),
                y: !start1Position.y
                    ? undefined
                    : (start1Position.y === 'top' ? 'bottom' : 'top'),
            }

            graphics.clear();
            this.renderLinearGradient(graphics, start1Position, targetBounds, length);
            graphics.drawRect(0, 0, targetBounds.width, targetBounds.height / 2);

            this.renderLinearGradient(graphics, start2Position, targetBounds, length);
            graphics.drawRect(0, targetBounds.height / 2, targetBounds.width, targetBounds.height / 2);

            const step = targetLength / speed;
            return {
                ...state,
                length: length + delta * step,
            };
        }

    private renderLinearGradient(graphics: Graphics, position: LinearGradientPosition, targetBounds: Rectangle, length: number): void {
        let startPositionX = targetBounds.height / 2;
        if (position.x) {
            startPositionX = position.x === 'left'
                ? Math.max(0, length - 3 * targetBounds.width / 5)
                : Math.min(targetBounds.width, targetBounds.width - length + 3 * targetBounds.width / 5);
        }

        let startPositionY = targetBounds.width / 2;
        if (position.y) {
            startPositionY = position.y === 'top'
                ? Math.max(0, length - 3 * targetBounds.height / 5)
                : Math.min(targetBounds.height, targetBounds.height - length + 3 * targetBounds.height / 5);
        }

        graphics.beginLinearGradientFill(
            ['rgba(0, 0, 0, 0)', '#000'],
            [0, 1],
            startPositionX,
            startPositionY,
            position.x
                ? (position.x === 'left' ? length : targetBounds.width - length)
                : targetBounds.height / 2,
                position.y
                ? (position.y === 'top' ? length : targetBounds.height - length)
                : targetBounds.width / 2,
        )
    }

    private animateLinearGradientHorizontalOutside(state: any, graphics: Graphics, targetBounds: Rectangle, delta: number, speed: number): any {
        const targetLength = targetBounds.width / 2;
        const length = state.length || 1;

        if (length > targetLength * 1.5) {
            return false;
        }

        graphics
            .clear()
            .beginLinearGradientFill(
                ['rgba(0, 0, 0, 0)', '#000'],
                [0, 1],
                Math.min(targetBounds.width / 2, targetBounds.width / 2 - length + 3 * targetBounds.width / 10),
                targetBounds.height / 2,
                targetBounds.width / 2 - length,
                targetBounds.height / 2,
            )
            .drawRect(0, 0, targetBounds.width / 2, targetBounds.height)
            .beginLinearGradientFill(
                ['rgba(0, 0, 0, 0)', '#000'],
                [0, 1],
                Math.max(targetBounds.width / 2, targetBounds.width / 2 + length - 3 * targetBounds.width / 10),
                targetBounds.height / 2,
                targetBounds.width / 2 + length,
                targetBounds.height / 2
            )
            .drawRect(targetBounds.width / 2, 0, targetBounds.width, targetBounds.height)

        const step = targetLength / speed;
        return {
            ...state,
            length: length + delta * step,
        };
    }

    private animateFadeIn(state: any, graphics: Graphics, targetBounds: Rectangle, delta: number, speed: number): any {
        const step = 1 / speed;
        const alpha = state.alpha === undefined ? 1 : state.alpha;

        if (alpha < 0) {
            return false;
        }

        graphics
            .clear()
            .beginFill(`rgba(0, 0, 0, ${alpha})`)
            .drawRect(0, 0, targetBounds.width, targetBounds.height);

        return {
            ...state,
            alpha: alpha - delta * step,
        };
    }
}