// Build 12.4 offline cache. Keep all core files together in the same folder.
const CACHE_PREFIX = 'refrigerant-cycle-pro:' + self.registration.scope + ':';
const CACHE = CACHE_PREFIX + 'v5-build12-4';
const CORE = ['./', './index.html', './manifest.webmanifest', './coolprop.js', './coolprop.wasm', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request)).then(cached => cached || fetch(event.request)));
});
