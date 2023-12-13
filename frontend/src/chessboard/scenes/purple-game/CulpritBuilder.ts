import { ucfirst } from "../../helpers/String";
import { CulpritPortrait, CulpritPortraits } from "./CulpritBoard";

export const buildPurpleStatements = (onClick: (character: string) => void): CulpritPortraits => {
    const battler = buildCulprit('ui_portrait', 'battler', '#a11e46', {left: true}, onClick);
    const eva = buildCulprit('ui_portrait_dead', 'eva', '#a11e46', {top: true}, null);
    const genji = buildCulprit('ui_portrait_dead', 'genji', '#2c1378', {}, null);
    const george = buildCulprit('ui_portrait', 'george', '#a11e46', {left: true}, onClick);
    const gohda = buildCulprit('ui_portrait', 'gohda', '#2c1378', {left: true}, onClick);
    const hideyoshi = buildCulprit('ui_portrait_dead', 'hideyoshi', '#a11e46', {left: true}, null);
    const jessica = buildCulprit('ui_portrait', 'jessica', '#a11e46', {left: true}, onClick);
    const kanon = buildCulprit('ui_portrait', 'kanon', '#2c1378', {left: true}, onClick);
    const krauss = buildCulprit('ui_portrait', 'krauss', '#2c1378', {}, onClick);
    const kumasawa = buildCulprit('ui_portrait', 'kumasawa', '#2c1378', {left: true}, onClick);
    const kyrie = buildCulprit('ui_portrait_dead', 'kyrie', '#a11e46', {left: true}, null);
    const maria = buildCulprit('ui_portrait', 'maria', '#a11e46', {left: true}, onClick);
    const nanjo = buildCulprit('ui_portrait', 'nanjo', '#2c1378', {}, onClick);
    const natsuhi = buildCulprit('ui_portrait', 'natsuhi', '#a11e46', {left: true}, onClick);
    const rosa = buildCulprit('ui_portrait_dead', 'rosa', '#a11e46', {right: true, top: true}, null);
    const rudolf = buildCulprit('ui_portrait_dead', 'rudolf', '#a11e46', {top: true}, null);
    const shannon = buildCulprit('ui_portrait', 'shannon', '#2c1378', {top: true}, onClick);

    return [
        [null, krauss, natsuhi, jessica],
        [nanjo, eva, hideyoshi, george],
        [null, rudolf, kyrie, battler],
        [genji, rosa, null, maria],
        [shannon, kanon, gohda, kumasawa],
    ];
}

export const buildCulprits = (): CulpritPortraits => {
    const battler = buildCulprit('ui_portrait', 'battler', '#a11e46', {left: true});
    const eva = buildCulprit('ui_portrait', 'eva', '#a11e46', {top: true});
    const genji = buildCulprit('ui_portrait', 'genji', '#2c1378');
    const george = buildCulprit('ui_portrait', 'george', '#a11e46', {left: true});
    const gohda = buildCulprit('ui_portrait', 'gohda', '#2c1378', {left: true});
    const hideyoshi = buildCulprit('ui_portrait', 'hideyoshi', '#a11e46', {left: true});
    const jessica = buildCulprit('ui_portrait', 'jessica', '#a11e46', {left: true});
    const kanon = buildCulprit('ui_portrait', 'kanon', '#2c1378', {left: true});
    const krauss = buildCulprit('ui_portrait', 'krauss');
    const kumasawa = buildCulprit('ui_portrait', 'kumasawa', '#2c1378', {left: true});
    const kyrie = buildCulprit('ui_portrait', 'kyrie', '#a11e46', {left: true});
    const maria = buildCulprit('ui_portrait', 'maria', '#a11e46', {left: true});
    const nanjo = buildCulprit('ui_portrait', 'nanjo');
    const natsuhi = buildCulprit('ui_portrait', 'natsuhi', '#a11e46', {left: true});
    const rosa = buildCulprit('ui_portrait', 'rosa', '#a11e46', {right: true, top: true});
    const rudolf = buildCulprit('ui_portrait', 'rudolf', '#a11e46', {top: true});
    const shannon = buildCulprit('ui_portrait', 'shannon', '#2c1378', {top: true});

    return [
        [null, krauss, natsuhi, jessica],
        [nanjo, eva, hideyoshi, george],
        [null, rudolf, kyrie, battler],
        [genji, rosa, null, maria],
        [shannon, kanon, gohda, kumasawa],
    ];
}

export const buildCulprit = (
    atlas: string,
    name: string, 
    line_color: string = '#a11e46', 
    connections: {left?: boolean, right?: boolean, top?: boolean, bottom?: boolean} = {},
    onClick = (character: string) => {},
): CulpritPortrait => {
    const culrpit: CulpritPortrait = {
        image: {
            default: [atlas, `Portrait${ucfirst(name)}.png`]
        },
        connections,
        line_color: line_color,
    };

    if (onClick) {
        culrpit.image.hover = [atlas, `Portrait${ucfirst(name)}_selected.png`];
        culrpit.on_click = () => onClick(name);
    }

    return culrpit;
}