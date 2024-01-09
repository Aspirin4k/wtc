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
    },
}

type Effect = 
    'fade-in'
    | 'gradient-radial' 
    | 'gradient-right' | 'gradient-left' | 'gradient-top' | 'gradient-bottom'
    | 'gradient-top-left' | 'gradient-top-right' | 'gradient-bottom-left' | 'gradient-bottom-right'
    | 'shake-bottom' | 'shake-top' | 'shake-left' | 'shake-right';

interface Background {
    url: string,
    effect: ("grayscale" | "rain")[]
}

interface Character {
    url: string,
    'z-index': 1 | 2 | 3,
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