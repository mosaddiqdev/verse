class App {
    constructor() {
        this.poems = new Poems();
        this.title = document.getElementById('poem-title');
        this.author = document.getElementById('poem-author');
        this.text = document.getElementById('poem-text');
        this.preloader = document.getElementById('preloader');
        this.content = document.getElementById('main-content');

        this.start();
    }

    async start() {
        try {
            const poem = await this.poems.get();
            await this.delay(1200);

            if (poem) {
                this.show(poem);
            } else {
                this.error();
            }

            this.hideLoader();

        } catch (err) {
            console.error('Failed to load poem:', err);
            this.error();
            this.hideLoader();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    hideLoader() {
        this.preloader.classList.add('fade-out');

        setTimeout(() => {
            this.content.classList.add('show');
        }, 300);

        setTimeout(() => {
            this.preloader.remove();
        }, 600);
    }

    show(poem) {
        this.title.textContent = poem.title;
        this.author.textContent = `by ${poem.author}`;
        this.buildPoem(poem.content);
        document.title = `${poem.title} — Verse`;
    }

    buildPoem(stanzas) {
        this.text.innerHTML = '';

        stanzas.forEach(stanza => {
            const div = document.createElement('div');
            div.className = 'stanza';

            stanza.split('\n').forEach(line => {
                if (line.trim()) {
                    const p = document.createElement('p');
                    p.textContent = line;
                    div.appendChild(p);
                }
            });

            this.text.appendChild(div);
        });
    }

    error() {
        this.title.textContent = 'Something went wrong';
        this.author.textContent = 'Please try again later';
        this.text.innerHTML = '<p>Unable to load today\'s poem. Please refresh the page.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
