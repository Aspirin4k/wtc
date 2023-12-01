import { CulpritPortrait } from "./CulpritBoard";

export const buildCulprit = (
    name: string, 
    line_color: string = '#a11e46', 
    connections: {left?: boolean, right?: boolean, top?: boolean, bottom?: boolean} = {}
): CulpritPortrait => {
    return {
        image: {
            default: `ui_portrait_${name}`,
            hover: `ui_portrait_${name}_selected`
        },
        connections,
        line_color: line_color,
    };
}