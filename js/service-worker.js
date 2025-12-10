const CACHE_NAME = 'both-v1';
const urlsToCache = [
  '/',
  '/html/index.html',
  '/css/global.css',
  '/css/premium.css',
  '/js/global.js',
  '/js/lazy-load.js',
  '/js/header.js',
  '/js/section-faq.js',
  '/js/section-reserva.js'
];

// Install event - cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache.addAll error:', err);
        });
      })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For images, use cache-first strategy
  if (event.request.url.includes('unsplash.com') || event.request.url.includes('images')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        }).catch(() => {
          // Return offline image placeholder if needed
          return new Response('Image not available offline');
        });
      })
    );
    return;
  }

  // For documents and scripts, use network-first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // Return cached version if network fails
        return caches.match(event.request).then(response => {
          return response || new Response('Offline - content not available');
        });
      })
  );
});