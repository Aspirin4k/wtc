interface ScreenState extends BaseProceeding {
    text: Text
}

interface Proceeding extends BaseProceeding {
    text?: ProceedingText,
    should_be_skipped?: boolean,
}

interface BaseProceeding {
    background?: Background,
    ambient?: {
        [name: string]: string,
    },
    characters?: {
        left_left?: Character | null,
        left?: Character | null,
        left_middle?: Character | null,
        middle?: Character | null,
        right_middle?: Character | null,
        right?: Character | null,
        right_right?: Character | null,
    },
    characters_meta?: {
        left?: Character | null,
        middle?: Character | null,
        right?: Character | null
    },
    effects?: {
        transition?: Effect,
        transition_speed?: number,
        auto_transition?: number,
        sound?: string,
        sound_delay?: number,
        visual?: Effect,
        bgm?: string,
        clock?: {
            to: string,
            from?: string,
            position: 'bottom-right' | 'right' | 'center'
        }
    },
}

type Effect = 
    'fade-in'
    | 'gradient-radial' 
    | 'gradient-right' | 'gradient-left' | 'gradient-top' | 'gradient-bottom'
    | 'gradient-top-left' | 'gradient-top-right' | 'gradient-bottom-left' | 'gradient-bottom-right'
    | 'gradient-left-right'
    | 'gradient-horizontal-outside'
    | 'shake-bottom' | 'shake-top' | 'shake-left' | 'shake-right';

interface Background {
    url: string,
    effect: ("grayscale" | "rain" | "meta" | "cinematic")[]
}

interface Character {
    url: string,
    'z-index': 1 | 2 | 3 | 4 | 5 | 6 | 7,
    x: number,
    width: number
}

interface Text {
    character?: string,
    content: string | null
}

interface ProceedingText extends Text {
    style: "add" | "replace",
    statement?: "start" | "continue" | "end"
}

export { ScreenState, Character, Text, Proceeding, Effect }