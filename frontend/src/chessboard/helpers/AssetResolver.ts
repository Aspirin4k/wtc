class AssetResolver {
    public static readonly LOCATION_MANSION = 'mainbuilding';

    public static readonly CHARACTER_BATTLER = 'ushiromia_battler';
    public static readonly CHARACTER_KRAUSS = 'ushiromia_krauss';
    public static readonly CHARACTER_GEORGE = 'ushiromia_george';

    private readonly mode: number;

    constructor(mode: number) {
        this.mode = mode;
    }

    public getResource(name: string): string {
        return `/chessboard/classic${name}`;
    }

    public getBackground(location: string, scene: string): string {
        return `/chessboard/classic/background/${location}/${scene}.bmp`;
    }

    public getCharacter(name: string, sprite: string): string {
        return `/chessboard/classic/character/${name}/${sprite}.png`;
    }
}

export { AssetResolver };