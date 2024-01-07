export class BGM {
    private volume: number = 0.2;
    private currents: {[name: string]: HTMLAudioElement} = {};

    public stop(name: string = null): void {
        if (null === name) {
            Object.keys(this.currents).forEach((name) => {
                this.stop(name);
            });

            return;
        }

        if (!this.currents[name]) {
            return
        }

        const audio = this.currents[name];

        audio.pause();
        audio.loop = false;
        audio.currentTime = 0;
        
        delete this.currents[name];
    }

    public changeVolume(volume: number): void {
        this.volume = volume > 1
            ? 1
            : (volume < 0 ? 0 : volume);
        Object.keys(this.currents).forEach((name) => {
            this.currents[name].volume = this.volume;
        })
    }

    public play(audio: HTMLAudioElement, name: string = 'default', mode: 'stop' | 'ignore' = 'stop'): void {
        if (mode === 'stop') {
            this.stop(name);
        }

        if (mode === 'ignore' && this.currents[name]) {
            return;
        }

        audio.loop = true;
        audio.play();
        audio.volume = this.volume;
        this.currents[name] = audio;
    }

    public playEffect(audio: HTMLAudioElement): void {
        audio.currentTime = 0;
        audio.volume = this.volume;
        audio.play();
    }
}