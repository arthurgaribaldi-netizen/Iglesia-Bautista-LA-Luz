// Service Worker for IEB La Luz Málaga PWA
// Version 2.0.0 - Performance Optimized

const CACHE_NAME = 'ieb-luz-malaga-v2.0.0';
const STATIC_CACHE = 'ieb-luz-static-v2.0.0';
const DYNAMIC_CACHE = 'ieb-luz-dynamic-v2.0.0';
const IMAGE_CACHE = 'ieb-luz-images-v2.0.0';
const API_CACHE = 'ieb-luz-api-v2.0.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.svg',
  '/icon-512x512.svg',
  '/apple-touch-icon.svg',
  '/favicon.svg',
  '/offline.html',
];

// Critical CSS and JS files
const CRITICAL_ASSETS = [
  '/_next/static/css/',
  '/_next/static/js/',
  '/_next/static/chunks/',
];

// API routes that should be cached with network-first strategy
const API_ROUTES = [
  '/api/events',
  '/api/sermons',
  '/api/contact',
  '/api/bible/search'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache critical assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching critical assets');
        return Promise.all(CRITICAL_ASSETS.map(asset => 
          cache.add(asset).catch(() => {
            console.warn(`Failed to cache critical asset: ${asset}`);
          })
        ));
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE].includes(cacheName)) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // API routes - Network First strategy with longer cache
  if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(networkFirstWithCacheStrategy(request, API_CACHE, 300000)); // 5 minutes
    return;
  }

  // Images - Cache First strategy with long cache
  if (isImageAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Static assets - Cache First strategy
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // HTML pages - Stale While Revalidate strategy
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Default - Network First for other requests
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

// Cache First Strategy - for static assets
async function cacheFirstStrategy(request, cacheName = STATIC_CACHE) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First Strategy failed:', error);
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network First Strategy - for API calls and dynamic content
async function networkFirstStrategy(request, cacheName = DYNAMIC_CACHE) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html') || new Response('Offline - Page not available', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network First with Cache Strategy - for API calls with time-based cache
async function networkFirstWithCacheStrategy(request, cacheName, maxAge) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      const responseWithHeaders = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...networkResponse.headers,
          'sw-cache-timestamp': Date.now().toString()
        }
      });
      cache.put(request, responseWithHeaders.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
      if (cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < maxAge) {
        return cachedResponse;
      }
    }

    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale While Revalidate Strategy - for HTML pages
async function staleWhileRevalidateStrategy(request, cacheName = DYNAMIC_CACHE) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Fetch from network in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cached content
  });

  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Check if request is for a static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  
  // Static file extensions
  const staticExtensions = ['.js', '.css', '.woff', '.woff2', '.ttf', '.eot'];
  
  // Next.js static assets
  if (url.pathname.startsWith('/_next/static/')) {
    return true;
  }
  
  // Favicon and manifest
  if (url.pathname === '/favicon.svg' || url.pathname === '/manifest.json') {
    return true;
  }
  
  // PWA icons
  if (url.pathname.match(/\/icon-\d+x\d+\.svg$/) || url.pathname === '/apple-touch-icon.svg') {
    return true;
  }
  
  // File extensions
  return staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

// Check if request is for an image asset
function isImageAsset(request) {
  const url = new URL(request.url);
  
  // Image file extensions
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif', '.ico'];
  
  // YouTube thumbnails
  if (url.hostname.includes('ytimg.com') || url.hostname.includes('youtube.com')) {
    return true;
  }
  
  // File extensions
  return imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline form submissions when connection is restored
  console.log('Service Worker: Performing background sync');
  // Implementation would go here for handling offline form submissions
}

// Push notifications (for future implementation)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver más',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: '/icon-192x192.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
