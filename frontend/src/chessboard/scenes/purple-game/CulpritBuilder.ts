import { ucfirst } from "../../helpers/String";
import { CulpritPortrait, CulpritPortraits } from "./CulpritBoard";
import { Game } from "./Scene";

export const buildPurpleStatements = (game: Game, onClick: (character: string) => void): CulpritPortraits => {
    const culprits: {[name: string]: CulpritPortrait} = Object.keys(game.characters).reduce((culprits, characterName) => {
        const characterSettings = game.characters[characterName];
        const isInitiallyDead = game.twilights[0].deaths.includes(characterName);

        culprits[characterName] = buildCulprit(
            isInitiallyDead ? 'ui_portrait_dead' : 'ui_portrait',
            characterName,
            characterSettings.relation.color,
            characterSettings.relation.sides,
            !isInitiallyDead && onClick,
        );

        return culprits;
    }, {});

    // @ts-ignore
    return game.culprit_board.map((row) => {
        return row.map((characterName) => {
            return null === characterName ? null : culprits[characterName];
        })
    });
}

export const buildCulprits = (game: Game, selected: string[], on_click: (character) => void): CulpritPortraits => {
    const culprits: {[name: string]: CulpritPortrait} = Object.keys(game.characters).reduce((culprits, characterName) => {
        const characterSettings = game.characters[characterName];

        culprits[characterName] = buildCulprit(
            selected.includes(characterName) ? 'ui_portrait_dead' : 'ui_portrait',
            characterName,
            characterSettings.relation.color,
            characterSettings.relation.sides,
            on_click,
        );

        return culprits;
    }, {});
    
    // @ts-ignore
    return game.culprit_board.map((row) => {
        return row.map((characterName) => {
            return null === characterName ? null : culprits[characterName];
        })
    });
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