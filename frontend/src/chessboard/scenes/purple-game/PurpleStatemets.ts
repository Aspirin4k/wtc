export class PurpleStatemets {
    private readonly byCharacter = {};
    private readonly byChapter = {};

    constructor(...twilights) {
        twilights.forEach((twilight) => {
            let currentPhrase = '';
            let currentActor = 'narrator';
            twilight.proceeding.forEach((step) => {
                const text = step.text;
                if (text?.content) {  
                    currentActor = text.character.toLowerCase();
                    currentPhrase += text.content;
                }

                if (!text || !text.statement || text.statement === 'end') {
                    if (currentPhrase.includes('<purple>') || currentPhrase.includes('<red>')) {
                        if (!this.byChapter[twilight.name]) {
                            this.byChapter[twilight.name] = [];
                        }
                        this.byChapter[twilight.name].push({actor: currentActor, phrase: currentPhrase});

                        if (!this.byCharacter[currentActor]) {
                            this.byCharacter[currentActor] = {};
                        }
                        if (!this.byCharacter[currentActor][twilight.name]) {
                            this.byCharacter[currentActor][twilight.name] = [];
                        }
                        this.byCharacter[currentActor][twilight.name].push(currentPhrase);
                    }
                    
                    currentPhrase = '';
                    return;
                }
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