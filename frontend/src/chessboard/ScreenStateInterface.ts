interface ScreenState {
    background: Background,
    characters: {
        left: Character | null,
        middle: Character | null,
        right: Character | null
    },
    text: Text
}

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

interface Proceeding {
    background?: Background,
    characters?: {
        left?: Character | null,
        middle?: Character | null,
        right?: Character | null
    },
    text?: ProceedingText
}

interface ProceedingText extends Text {
    style: "add" | "replace",
    statement?: "start" | "continue" | "end"
}

export { ScreenState, Character, Text, Proceeding }