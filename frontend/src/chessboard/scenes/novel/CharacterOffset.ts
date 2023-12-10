export const getCharacterX = (char: string, x: number): number => {
    char = char.toLowerCase();
    switch (char) {
        case 'krauss':
            return x - 70;
        case 'george':
            return x - 30;
        case 'maria':
            return x - 160;
        default:
            return x;
    }
};