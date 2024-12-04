const CACHE_NAME = 'v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/chat.html',
    '/perfil.html',
    '/libros.html',
    'styles.css',
    'assets/logo.png',
    'assets/icons/icon-500x500.png',
    'firebaseConfig.js',
    'scripts.js',
    'assets/favicon.ico'  
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install Event processing');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching individual files');
            return Promise.all(
                FILES_TO_CACHE.map((file) => {
                    return cache.add(file).then(() => {
                        console.log(`[Service Worker] Successfully cached: ${file}`);
                    }).catch((error) => {
                        console.error(`[Service Worker] Failed to cache: ${file}`, error);
                    });
                })
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activate Event processing');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log(`[Service Worker] Removing old cache: ${key}`);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.log('[Service Worker] Found in cache: ', event.request.url);
                return response;
            }
            console.log('[Service Worker] Network request for: ', event.request.url);
            return fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request.url, networkResponse.clone());
                    return networkResponse;
                });
            });
        }).catch((error) => {
            console.error('[Service Worker] Fetching failed: ', error);
            return caches.match('/index.html');
        })
    );
});
