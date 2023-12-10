import { CulpritPortrait, CulpritPortraits } from "./CulpritBoard";

export const buildPurpleStatements = (onClick: (character: string) => void): CulpritPortraits => {
    const battler = buildCulprit('battler', '#a11e46', {left: true}, onClick);
    const eva = buildCulprit('eva_dead', '#a11e46', {top: true}, null);
    const genji = buildCulprit('genji_dead', '#2c1378', {}, null);
    const george = buildCulprit('george', '#a11e46', {left: true}, onClick);
    const gohda = buildCulprit('gohda', '#2c1378', {left: true}, onClick);
    const hideyoshi = buildCulprit('hideyoshi_dead', '#a11e46', {left: true}, null);
    const jessica = buildCulprit('jessica', '#a11e46', {left: true}, onClick);
    const kanon = buildCulprit('kanon', '#2c1378', {left: true}, onClick);
    const krauss = buildCulprit('krauss', '#2c1378', {}, onClick);
    const kumasawa = buildCulprit('kumasawa', '#2c1378', {left: true}, onClick);
    const kyrie = buildCulprit('kyrie_dead', '#a11e46', {left: true}, null);
    const maria = buildCulprit('maria', '#a11e46', {left: true}, onClick);
    const nanjo = buildCulprit('nanjo', '#2c1378', {}, onClick);
    const natsuhi = buildCulprit('natsuhi', '#a11e46', {left: true}, onClick);
    const rosa = buildCulprit('rosa_dead', '#a11e46', {right: true, top: true}, null);
    const rudolf = buildCulprit('rudolf_dead', '#a11e46', {top: true}, null);
    const shannon = buildCulprit('shannon', '#2c1378', {top: true}, onClick);

    return [
        [null, krauss, natsuhi, jessica],
        [nanjo, eva, hideyoshi, george],
        [null, rudolf, kyrie, battler],
        [genji, rosa, null, maria],
        [shannon, kanon, gohda, kumasawa],
    ];
}

export const buildCulprits = (): CulpritPortraits => {
    const battler = buildCulprit('battler', '#a11e46', {left: true});
    const eva = buildCulprit('eva', '#a11e46', {top: true});
    const genji = buildCulprit('genji', '#2c1378');
    const george = buildCulprit('george', '#a11e46', {left: true});
    const gohda = buildCulprit('gohda', '#2c1378', {left: true});
    const hideyoshi = buildCulprit('hideyoshi', '#a11e46', {left: true});
    const jessica = buildCulprit('jessica', '#a11e46', {left: true});
    const kanon = buildCulprit('kanon', '#2c1378', {left: true});
    const krauss = buildCulprit('krauss');
    const kumasawa = buildCulprit('kumasawa', '#2c1378', {left: true});
    const kyrie = buildCulprit('kyrie', '#a11e46', {left: true});
    const maria = buildCulprit('maria', '#a11e46', {left: true});
    const nanjo = buildCulprit('nanjo');
    const natsuhi = buildCulprit('natsuhi', '#a11e46', {left: true});
    const rosa = buildCulprit('rosa', '#a11e46', {right: true, top: true});
    const rudolf = buildCulprit('rudolf', '#a11e46', {top: true});
    const shannon = buildCulprit('shannon', '#2c1378', {top: true});

    return [
        [null, krauss, natsuhi, jessica],
        [nanjo, eva, hideyoshi, george],
        [null, rudolf, kyrie, battler],
        [genji, rosa, null, maria],
        [shannon, kanon, gohda, kumasawa],
    ];
}

export const buildCulprit = (
    name: string, 
    line_color: string = '#a11e46', 
    connections: {left?: boolean, right?: boolean, top?: boolean, bottom?: boolean} = {},
    onClick = (character: string) => {},
): CulpritPortrait => {
    const culrpit: CulpritPortrait = {
        image: {
            default: `ui_portrait_${name}`
        },
        connections,
        line_color: line_color,
    };

    if (onClick) {
        culrpit.image.hover = `ui_portrait_${name}_selected`;
        culrpit.on_click = () => onClick(name);
    }

    return culrpit;
}