
const CACHE_NAME = 'multiaventura-pro-cache-v1';
const ASSETS_TO_CACHE = [
  './', // Caches the root HTML file
  'index.html',
  'index.css',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'constants.ts',
  'service-worker.js', // Cache the service worker itself
  'manifest.json',
  'apple-touch-icon.png',
  'icon-192x192.png',
  'icon-512x512.png',
  'logo2.png', // Added for PWA caching
  'services/assets.ts', // Added for PWA caching
  'services/audioService.ts', // Added for PWA caching
  '/audios/amazing.mp3',
  '/audios/checkagain.mp3',
  '/audios/cool.mp3',
  '/audios/dontgiveup.mp3',
  '/audios/excellent.mp3',
  '/audios/iamsorry.mp3',
  '/audios/ibelieveinyou.mp3',
  '/audios/maybenexttime.mp3',
  '/audios/nicetry.mp3',
  '/audios/ooops.mp3',
  '/audios/oops-try-again.mp3',
  '/audios/tryagain.mp3',
  '/audios/waytogo.mp3',
  '/audios/welcome.mp3',
  '/audios/welcomeback.mp3',
  '/audios/younailedit.mp3',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js',
  'https://esm.sh/react@^19.2.4',
  'https://esm.sh/react-dom@^19.2.4/client'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cacheando assets de la aplicación:', ASSETS_TO_CACHE);
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((error) => {
        console.error('[Service Worker] Fallo en el caché durante la instalación:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activado y cachés antiguas eliminadas.');
      return self.clients.claim(); // Ensures the service worker activates for all clients immediately
    })
  );
});

self.addEventListener('fetch', (event) => {
  // console.log('[Service Worker] Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // console.log('[Service Worker] Sirviendo desde caché:', event.request.url);
        return response; // Serve from cache
      }
      // console.log('[Service Worker] Obteniendo de la red:', event.request.url);
      return fetch(event.request).catch((error) => {
        console.error('[Service Worker] Fallo en la red para:', event.request.url, error);
        // Fallback for offline if not in cache (e.g. for dynamic requests)
        // You might want to serve an offline page here
        return new Response('<h1>Offline</h1><p>No se pudo cargar la página sin conexión.</p>', {
          headers: { 'Content-Type': 'text/html' }
        });
      });
    })
  );
});