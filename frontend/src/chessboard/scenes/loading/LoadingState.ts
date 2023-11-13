import { Container } from "../../ui/Container";
import { Size } from "../../ui/Interfaces";

export class LoadingState {
    private readonly maximum: number;
    private readonly barWidth: number;
    private readonly barHeight: number;
    private bars: Container[] = [];
    private current: number = 0;

    constructor(maximum: number, barSize: Size) {
        this.maximum = maximum;
        this.barHeight = barSize.height;
        this.barWidth = barSize.width;

        for (let i = 0; i < maximum; i++) {
            this.bars.push(
                new Container(
                    {
                        position: {
                            x: i * this.barWidth,
                            y: 0
                        },
                        size: {
                            height: this.barHeight,
                            width: this.barWidth
                        },
                        background: 'black'
                    }
                )
            )
        }
    }

    public increment(): void {
        if (this.current >= this.maximum) {
            return;
        }

        this.bars[this.current] = new Container(
            {
                position: {
                    x: this.current * this.barWidth,
                    y: 0
                },
                size: {
                    height: this.barHeight,
                    width: this.barWidth
                },
                background: 'yellow'
            }
        );
        this.current++;
    }

    public getBars(): Container[] {
        return this.bars;
    }
}