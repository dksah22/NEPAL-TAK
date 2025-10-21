/* Service Worker - save as sw.js in repo root */
const CACHE = 'nepaltak-cache-v1';
const FILES = [
  '/',
  '/index.html',
  '/manifest.json'
];
self.addEventListener('install', (evt) => {
  evt.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', (evt) => {
  evt.waitUntil(caches.keys().then((keys) => Promise.all(keys.map(k => { if(k !== CACHE) return caches.delete(k); }))));
  self.clients.claim();
});
self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(caches.match(evt.request).then((resp) => resp || fetch(evt.request).then(r=>{return caches.open(CACHE).then(c=>{c.put(evt.request, r.clone()); return r;})})).catch(()=>caches.match('/')));
});
