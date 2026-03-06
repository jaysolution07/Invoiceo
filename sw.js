const CACHE = 'invoiceo-v1';
const FILES = ['./', './index.html', './logo2.png'];

self.addEventListener('install', e => {
  self.skipWaiting();   // ← AJOUTE ICI
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
});

self.addEventListener('activate', e => {
  self.clients.claim();  // ← AJOUTE AUSSI ÇA
});

self.addEventListener('fetch', e => {
  // Ne jamais intercepter les appels vers Google Scripts
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
