class Poems {
    constructor() {
        this.index = null;
    }

    async loadIndex() {
        try {
            const response = await fetch('src/data/poem_index.json');
            this.index = await response.json();
            return true;
        } catch (err) {
            console.error('Failed to load poem index:', err);
            return false;
        }
    }

    getMood() {
        const today = new Date();
        const days = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
        const moods = ['calm_mind', 'warm_heart', 'process_feelings', 'lift_spirits',
                      'find_motivation', 'remember_reflect', 'think_deeply', 'feel_powerful', 'surprise_me'];
        return moods[days % moods.length];
    }

    getToday() {
        if (!this.index) return null;

        const mood = this.getMood();
        const poems = this.index.poems.filter(poem => poem.mood === mood);

        if (poems.length === 0) return null;

        const today = new Date();
        const days = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
        const index = days % poems.length;

        return poems[index];
    }

    async loadContent(poem) {
        try {
            const response = await fetch(`src/data/${poem.file_path}`);
            const content = await response.text();
            return this.format(content);
        } catch (err) {
            console.error('Failed to load poem content:', err);
            return null;
        }
    }

    format(content) {
        let text = content.trim();
        const stanzas = text.split(/\n\s*\n/);

        return stanzas.map(stanza => {
            const lines = stanza.trim().split('\n');
            return lines.map(line => line.trim()).join('\n');
        });
    }

    cleanTitle(title) {
        let clean = title
            .replace(/^\d+/, '')
            .replace(/^[A-Z][a-z]+Poems/, '')
            .replace(/Poem$/, '')
            .trim();

        clean = clean.replace(/([a-z])([A-Z])/g, '$1 $2');

        return clean.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    cleanAuthor(author) {
        return author
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    getMoodName(mood) {
        const names = {
            calm_mind: "Calm Mind",
            warm_heart: "Warm Heart",
            process_feelings: "Process Feelings",
            lift_spirits: "Lift Spirits",
            find_motivation: "Find Motivation",
            remember_reflect: "Remember & Reflect",
            think_deeply: "Think Deeply",
            feel_powerful: "Feel Powerful",
            surprise_me: "Surprise Me"
        };
        return names[mood] || mood;
    }

    async get() {
        if (!this.index) {
            const loaded = await this.loadIndex();
            if (!loaded) return null;
        }

        const meta = this.getToday();
        if (!meta) return null;

        const content = await this.loadContent(meta);
        if (!content) return null;

        return {
            title: this.cleanTitle(meta.title),
            author: this.cleanAuthor(meta.author),
            content: content,
            mood: this.getMoodName(meta.mood),
            topic: meta.topic,
            wordCount: meta.word_count
        };
    }
}
