import {Container as CreateJSContainer, Shape} from 'createjs-module';

import { AssetManager } from "../../helpers/AssetManager";
import { Container } from "../../ui/Container";
import { Element } from "../../ui/Element";
import { Image } from "../../ui/Image";
import { ExactPosition } from "../../ui/Interfaces";

export type CulpritPortraits = [
    [CulpritPortrait, CulpritPortrait, CulpritPortrait, CulpritPortrait],
    [CulpritPortrait, CulpritPortrait, CulpritPortrait, CulpritPortrait],
    [CulpritPortrait, CulpritPortrait, CulpritPortrait, CulpritPortrait],
    [CulpritPortrait, CulpritPortrait, CulpritPortrait, CulpritPortrait],
    [CulpritPortrait, CulpritPortrait, CulpritPortrait, CulpritPortrait],
]

export type CulpritPortrait = {
    image: {
        default: string,
        hover?: string,
    },
    connections: {
        left?: boolean,
        right?: boolean,
        top?: boolean,
        bottom?: boolean
    },
    line_color: string,
    on_click?: () => void,
} | null

export class CulpritBoard {
    private readonly WIDTH = 172;
    private readonly HEIGHT = 228;
    private readonly VERTICAL_SPACING = 9;
    private readonly HORIZONTAL_SPACING = 13;

    private readonly asset_manager: AssetManager;
    private readonly board: CulpritPortraits;

    constructor(asset_manager: AssetManager, board: CulpritPortraits) {
        this.asset_manager = asset_manager;
        this.board = board;
    }

    public render(position: ExactPosition): Element {
        const container = new Container(
            {
                position,
                size: {width: this.WIDTH, height: this.HEIGHT},
                background: 'black'
            },
            this.board.reduce(
                (result, culpritRow, y) => {
                    culpritRow.forEach((culprit, x) => {
                        if (null === culprit) {
                            return;
                        }

                        result.push(new Image(
                            this.asset_manager,
                            {
                                position: {x: this.getCulpritX(x), y: this.getCulpritY(y)},
                                background: culprit.image.default,
                                backgroundOver: culprit.image.hover,
                                on_click: culprit.on_click,
                            }
                        ));
                    })

                    return result;
                },
                []
            )
        );

        const canvas = ((container.getCreateJSObject() as CreateJSContainer).children[0] as Shape).graphics;
        this.board.forEach((culpritRow, y) => {
            culpritRow.forEach((culprit, x) => {
                if (!culprit) {
                    return;
                }

                if (culprit.connections.left && x > 0) {
                    canvas
                        .beginStroke(culprit.line_color)
                        .setStrokeStyle(2)
                        .moveTo(this.getCulpritX(x) + 16, this.getCulpritY(y) + 18)
                        .lineTo(this.getCulpritX(x - 1) + 16, this.getCulpritY(y) + 18)
                        .endStroke();
                }

                if (culprit.connections.right && x < culpritRow.length - 1) {
                    canvas
                        .beginStroke(culprit.line_color)
                        .setStrokeStyle(2)
                        .moveTo(this.getCulpritX(x) + 16, this.getCulpritY(y) + 18)
                        .lineTo(this.getCulpritX(x + 1) + 16, this.getCulpritY(y) + 18)
                        .endStroke();
                }

                if (culprit.connections.top && y > 0 && x === 0) {
                    canvas
                        .beginStroke(culprit.line_color)
                        .setStrokeStyle(2)
                        .moveTo(this.getCulpritX(x) + 16, this.getCulpritY(y) + 18)
                        .lineTo(this.getCulpritX(x) + 16, this.getCulpritY(y - 1) + 18)
                        .endStroke();
                }

                if (culprit.connections.bottom && y < this.board.length - 1 && x === 0) {
                    canvas
                        .beginStroke(culprit.line_color)
                        .setStrokeStyle(2)
                        .moveTo(this.getCulpritX(x) + 16, this.getCulpritY(y) + 18)
                        .lineTo(this.getCulpritX(x) + 16, this.getCulpritY(y + 1) + 18)
                        .endStroke();
                }

                if (culprit.connections.top && y > 0 && x > 0) {
                    canvas
                        .beginStroke(culprit.line_color)
                        .setStrokeStyle(2)
                        .moveTo(this.getCulpritX(x) + 16, this.getCulpritY(y) + 18)
                        .lineTo(this.getCulpritX(x) - this.HORIZONTAL_SPACING / 2, this.getCulpritY(y) + 18)
                        .lineTo(this.getCulpritX(x) - this.HORIZONTAL_SPACING / 2, this.getCulpritY(y - 1) + 18)
                        .lineTo(this.getCulpritX(x) + 16, this.getCulpritY(y - 1) + 18)
                        .endStroke();
                }

                if (culprit.connections.bottom && y < this.board.length - 1 && x > 0) {
                    canvas
                        .beginStroke(culprit.line_color)
                        .setStrokeStyle(2)
                        .moveTo(this.getCulpritX(x) + 16, this.getCulpritY(y) + 18)
                        .lineTo(this.getCulpritX(x) - this.HORIZONTAL_SPACING / 2, this.getCulpritY(y) + 18)
                        .lineTo(this.getCulpritX(x) - this.HORIZONTAL_SPACING / 2, this.getCulpritY(y + 1) + 18)
                        .lineTo(this.getCulpritX(x) + 16, this.getCulpritY(y + 1) + 18)
                        .endStroke();
                }
            });
        })

        return container;
    }

    private getCulpritX(rowX: number): number {
        return rowX * (31 + this.HORIZONTAL_SPACING) + 3;
    }

    private getCulpritY(rowY: number): number {
        return rowY * (36 + this.VERTICAL_SPACING) + this.VERTICAL_SPACING / 2;
    }
}