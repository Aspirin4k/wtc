export class BGM {
    private current: HTMLAudioElement = null;

    public stop(): void {
        if (!this.current) {
            return;
        }

        this.current.pause();
        this.current.loop = false;
        this.current.currentTime = 0;
        this.current = null;
    }

    public play(audio: HTMLAudioElement): void {
        audio.loop = true;
        this.current = audio;
        this.current.play();
    }
}