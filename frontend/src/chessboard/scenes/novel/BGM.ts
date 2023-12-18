export class BGM {
    private currents: {[name: string]: HTMLAudioElement} = {};

    public stop(): void {
        Object.keys(this.currents).forEach((name) => {
            const audio = this.currents[name];

            audio.pause();
            audio.loop = false;
            audio.currentTime = 0;
        });

        this.currents = {};
    }

    public play(audio: HTMLAudioElement, name: string = 'default'): void {
        audio.loop = true;
        audio.play();
        this.currents[name] = audio;
    }
}