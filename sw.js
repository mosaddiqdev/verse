const VERSION = 'v1';
const STATIC = `verse-static-${VERSION}`;
const DATA = `verse-data-${VERSION}`;

const FILES = [
  '/',
  '/index.html',
  '/about.html',
  '/src/css/main.css',
  '/src/js/app.js',
  '/src/js/poem-loader.js',
  '/src/data/poem_index.json',
  '/src/assets/icon-16.svg',
  '/src/assets/icon-32.svg',
  '/src/assets/icon-48.svg',
  '/src/assets/icon-64.svg',
  '/src/assets/icon-128.svg',
  '/src/assets/icon-192.svg',
  '/src/assets/icon-256.svg',
  '/src/assets/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => {
        return Promise.all(
          names.map(name => {
            if (name !== STATIC && name !== DATA) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname.includes('/src/data/')) {
    event.respondWith(handleData(event.request));
    return;
  }

  event.respondWith(handleStatic(event.request));
});

async function handleData(request) {
  const cache = await caches.open(DATA);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response(
      JSON.stringify({
        title: "Offline",
        author: "Verse",
        content: ["We're currently offline.\nYour daily poem will return\nwhen connection is restored."],
        mood: "Patience"
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleStatic(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    return await fetch(request);
  } catch {
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/index.html');
    }
  }
}

self.addEventListener('sync', event => {
  if (event.tag === 'cache-poems') {
    event.waitUntil(cachePoems());
  }
});

async function cachePoems() {
  try {
    const cache = await caches.open(DATA);
    const response = await fetch('/src/data/poem_index.json');
    const index = await response.json();

    const today = new Date();
    const days = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

    for (let i = 0; i < 7; i++) {
      const day = days + i;
      const moods = ['calm_mind', 'warm_heart', 'process_feelings', 'lift_spirits',
                    'find_motivation', 'remember_reflect', 'think_deeply', 'feel_powerful', 'surprise_me'];
      const mood = moods[day % moods.length];
      const poems = index.poems.filter(poem => poem.mood === mood);

      if (poems.length > 0) {
        const poem = poems[day % poems.length];

        try {
          const poemResponse = await fetch(`/src/data/${poem.file_path}`);
          if (poemResponse.ok) {
            await cache.put(`/src/data/${poem.file_path}`, poemResponse);
          }
        } catch {}
      }
    }
  } catch {}
}
