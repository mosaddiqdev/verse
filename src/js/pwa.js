class Install {
    constructor() {
        this.prompt = null;
        this.setup();
    }

    setup() {
        this.handleInstall();
        this.handleOffline();
    }

    handleInstall() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.prompt = e;
            this.showPrompt();
        });

        window.addEventListener('appinstalled', () => {
            this.hidePrompt();
            this.prompt = null;
        });
    }

    showPrompt() {
        setTimeout(() => {
            if (this.prompt && !window.matchMedia('(display-mode: standalone)').matches) {
                this.create();
            }
        }, 30000);
    }

    create() {
        const banner = document.createElement('div');
        banner.className = 'install-prompt';
        banner.innerHTML = `
            <div class="install-content">
                <p>Install app?</p>
                <div class="install-actions">
                    <button class="install-btn" id="install-btn">Yes</button>
                    <button class="dismiss-btn" id="dismiss-btn">×</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('install-btn').addEventListener('click', () => {
            this.install();
        });

        document.getElementById('dismiss-btn').addEventListener('click', () => {
            this.hide();
        });

        setTimeout(() => {
            if (banner.parentNode) {
                this.hide();
            }
        }, 10000);
    }

    async install() {
        if (this.prompt) {
            this.prompt.prompt();
            await this.prompt.userChoice;
            this.prompt = null;
            this.hide();
        }
    }

    hide() {
        const prompt = document.querySelector('.install-prompt');
        if (prompt) {
            prompt.remove();
        }
    }

    handleOffline() {
        window.addEventListener('online', () => {
            this.hideOffline();
        });

        window.addEventListener('offline', () => {
            this.showOffline();
        });

        if (!navigator.onLine) {
            this.showOffline();
        }
    }

    showOffline() {
        const msg = document.createElement('div');
        msg.className = 'offline-message';
        msg.innerHTML = `
            <div class="offline-content">
                <p>You're offline. Cached poems are still available.</p>
            </div>
        `;

        document.body.appendChild(msg);

        setTimeout(() => {
            msg.classList.add('show');
        }, 100);
    }

    hideOffline() {
        const msg = document.querySelector('.offline-message');
        if (msg) {
            msg.classList.remove('show');
            setTimeout(() => {
                msg.remove();
            }, 300);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Install();
});
