const CACHE = 'invoiceo-v3';
const FILES = ['./', './index.html', './logo.png', './logo2.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
});

self.addEventListener('activate', e => {
  // Supprimer tous les anciens caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Ne jamais intercepter Google Scripts
  if (e.request.url.includes('script.google.com')) return;

  // Pour index.html → toujours réseau en priorité, cache en fallback
  if (e.request.url.endsWith('/') || e.request.url.includes('index.html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Pour le reste → cache en priorité
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
