// Service Worker for ICICI iMobile Pay PWA
const CACHE_NAME = 'icici-imobile-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let browser handle network requests
});
