const CACHE = 'invoiceo-v4';
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
  // on ignore Google Apps Script
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    fetch(e.request, { cache: "no-store" }) // 🔥 toujours version fraîche
      .catch(() => caches.match(e.request)) // fallback offline
  );
});
