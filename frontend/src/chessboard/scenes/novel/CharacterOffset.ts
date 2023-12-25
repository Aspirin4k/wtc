export const getCharacterX = (char: string, x: number): number => {
    char = char.toLowerCase();
    switch (char) {
        case 'ushiromia_krauss':
        case 'krauss':
            return x - 95;
        case 'ushiromia_natsuhi':
            return x - 47;
        case 'kanon':
            return x - 10;
        case 'shannon':
            return x - 22;
        case 'ushiromia_jessica':
        case 'ushiromia_battler_cape':
            return x - 30;
        case 'ushiromia_george':
        case 'george':
            return x - 40;
        case 'ushiromia_maria':
        case 'maria':
            return x - 180;
        case 'bernkastel':
        case 'lambdadelta':
            return x - 70;
        case 'beatrice':
            return x - 140;
        default:
            return x;
    }
};