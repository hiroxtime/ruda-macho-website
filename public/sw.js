const CACHE_NAME = 'ruda-macho-v2'; // Cambiado de v1 a v2 para invalidar cache anterior
const STATIC_ASSETS = [
  '/assets/Logo%20Ruda%20Macho.png',
  '/manifest.json'
];

// Páginas que NO deben cachearse (siempre obtener versión nueva)
const NO_CACHE_PAGES = [
  '/',
  '/ruda-school',
  '/ruda-tv',
  '/streaming',
  '/perfil',
  '/login',
  '/registro'
];

// Install event - solo cache assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
  self.skipWaiting(); // Forzar activación inmediata
});

// Fetch event - network first para HTML, cache first para assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Para páginas HTML (navegación), usar network-first
  if (event.request.mode === 'navigate' || NO_CACHE_PAGES.some(page => url.pathname.startsWith(page))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la respuesta es válida, clonar y guardar en cache
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, servir desde cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Para assets estáticos, cache-first
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || event.request.method !== 'GET') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
  );
});

// Activate event - limpiar caches antiguos y tomar control inmediato
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Eliminar TODOS los caches excepto el actual
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Tomar control inmediatamente sin esperar reload
  self.clients.claim();
});