import { Bitmap, Container, Ease, Tween } from "createjs-module";
import { AssetManager } from "../../../helpers/AssetManager";
import { getBitmap } from "../../../helpers/Image";

export class Clock {
    private readonly asset_manager: AssetManager;

    private tweenClock: Tween;
    private tweenHandMinutes: Tween;
    private tweenHandHours: Tween;

    constructor(asset_manager: AssetManager) {
        this.asset_manager = asset_manager;
    }

    isAnimating(): boolean {
        return this.tweenClock && this.tweenClock.position !== this.tweenClock.duration
            || this.tweenHandMinutes && this.tweenHandMinutes.position !== this.tweenHandMinutes.duration
            || this.tweenHandHours && this.tweenHandHours.position !== this.tweenHandHours.duration;
    }

    stop(): void {
        if (this.tweenClock) {
            this.tweenClock.setPosition(this.tweenClock.duration, 1);
        }

        if (this.tweenHandMinutes) {
            this.tweenHandMinutes.setPosition(this.tweenHandMinutes.duration, 1);
        }

        if (this.tweenHandHours) {
            this.tweenHandHours.setPosition(this.tweenHandHours.duration, 1);
        }
    }

    renderClocks(to: string, from: string = null): Container {
        const [hours, minutes] = (from || to).split(':').map((val) => parseInt(val));

        const face = this.renderFace(hours, minutes);
        face.alpha = 0;

        this.tweenHandHours = null;
        this.tweenHandMinutes = null;
        this.tweenClock = Tween
            .get(face)
            .to({alpha: 1}, 300)
            .call(() => {
                if (!from) {
                    return;
                }

                const [targetHours, targetMinutes] = to.split(':').map((val) => parseInt(val));
                const fromMinutes = hours * 60 + minutes;
                const toMinutes = targetHours * 60 + targetMinutes;

                const handMinutes = face.getChildByName('minutes');
                this.tweenHandMinutes = Tween
                    .get(handMinutes)
                    .to({rotation: handMinutes.rotation + (toMinutes - fromMinutes) * 6}, 5000, Ease.cubicInOut);
                const handHours = face.getChildByName('hours');
                this.tweenHandHours = Tween
                    .get(handHours)
                    .to({rotation: handHours.rotation + (toMinutes - fromMinutes) / 2}, 5000, Ease.cubicInOut);
            });

        return face;
    }

    private renderFace(hours: number, minutes: number): Container {
        const container = new Container();

        const clock = this.getBitmap('clock');
        container.addChild(clock);

        const hand_minutes = this.getBitmap('clock_m');
        hand_minutes.name = 'minutes';
        hand_minutes.regX = hand_minutes.getBounds().width / 2;
        hand_minutes.regY = hand_minutes.getBounds().height / 2;
        hand_minutes.x = container.getBounds().width / 2;
        hand_minutes.y = container.getBounds().height / 2;
        hand_minutes.rotation = minutes * 6;
        container.addChild(hand_minutes);

        const hand_hours = this.getBitmap('clock_h');
        hand_hours.name = 'hours';
        hand_hours.regX = hand_hours.getBounds().width / 2;
        hand_hours.regY = hand_hours.getBounds().height / 2;
        hand_hours.x = container.getBounds().width / 2;
        hand_hours.y = container.getBounds().height / 2;
        hand_hours.rotation = hours * 30 + minutes / 2;
        container.addChild(hand_hours);

        
        const point = this.getBitmap('clock_c');
        point.regX = point.getBounds().width / 2;
        point.regY = point.getBounds().height / 2;
        point.x = container.getBounds().width / 2;
        point.y = container.getBounds().height / 2;
        container.addChild(point);

        return container;
    }

    private getBitmap(name: string): Bitmap {
        const img = this.asset_manager.getImage(name);
        return getBitmap(img, img.width / 3, img.height / 3);
    }
};
