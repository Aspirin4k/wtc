export class PurpleStatemets {
    private readonly byCharacter = {};
    private readonly byChapter = {};

    constructor(...twilights) {
        twilights.forEach((twilight) => {
            let currentPhrase = '';
            let currentActor = 'narrator';
            twilight.proceeding.forEach((step) => {
                if (!step.text) {
                    return;
                }

                const text = step.text;
                if (text.character && currentActor !== text.character.toLowerCase()) {
                    if (currentActor !== 'narrator' && currentPhrase.includes('<purple>')) {
                        if (!this.byChapter[twilight.name]) {
                            this.byChapter[twilight.name] = {};
                        }
                        if (!this.byChapter[twilight.name][currentActor]) {
                            this.byChapter[twilight.name][currentActor] = [];
                        }
                        this.byChapter[twilight.name][currentActor].push(currentPhrase);

                        if (!this.byCharacter[currentActor]) {
                            this.byCharacter[currentActor] = {};
                        }
                        if (!this.byCharacter[currentActor][twilight.name]) {
                            this.byCharacter[currentActor][twilight.name] = [];
                        }
                        this.byCharacter[currentActor][twilight.name].push(currentPhrase);
                    }
                    
                    currentActor = text.character.toLowerCase();
                    currentPhrase = text.content;
                    return;
                }

                currentPhrase += text.content;
            })
        });
    }

    public getByCharater(character: string) {
        return this.byCharacter[character] || {};
    }

    public getByChapter(chapter: string) {
        return this.byChapter[chapter] || {};
    }
}