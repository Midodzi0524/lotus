// Lotus Service Worker - Offline Cache
const CACHE_NAME = 'lotus-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/data/index.json',
  '/data/companies.json',
  '/data/funding.json',
  '/data/glossary.json',
  '/data/trends.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request)
          .then(res => {
            if (!res || res.status !== 200 || res.type !== 'basic') return res;
            const resClone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
            return res;
          })
          .catch(() => cached)
      );
    })
  );
});
