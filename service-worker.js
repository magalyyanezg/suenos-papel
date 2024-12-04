const CACHE_NAME = 'v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/chat.html',
                '/perfil.html',
                '/libros.html',
                'styles.css',
                'assets/logo.png',
                'assets/icons/icon-192x192.png',
                'assets/icons/icon-512x512.png',
                'firebaseConfig.js',
                'scripts.js',
                '/fallback.html'  // Incluir fallback.html en la caché
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/chats')) {
        return;  // No cachear peticiones al chat en tiempo real
    }
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // Si la solicitud falla, devolver el recurso correspondiente del caché
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    } else if (event.request.mode === 'navigate') {
                        // Devolver fallback.html para solicitudes de navegación
                        return caches.match('/fallback.html');
                    }
                });
            });
        })
    );
});
