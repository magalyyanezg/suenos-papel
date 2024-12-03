self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
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
                'scripts.js'
            ]);
        })
    );
});
// Activate event: clean up old caches
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
            return response || fetch(event.request); 
        })
    );
});