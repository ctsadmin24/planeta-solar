const CACHE_NAME = "planetasolar-cache-v4";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/css/main.css",
  "/assets/js/main.js",
  "/assets/vendor/bootstrap/css/bootstrap.min.css",
  "/assets/vendor/bootstrap/js/bootstrap.bundle.min.js",
  "/assets/vendor/aos/aos.css",
  "/assets/vendor/glightbox/css/glightbox.min.css",
  "/assets/vendor/swiper/swiper-bundle.min.css",
  "/assets/vendor/aos/aos.js",
  "/assets/vendor/glightbox/js/glightbox.min.js",
  "/assets/vendor/swiper/swiper-bundle.min.js",
  "/assets/img/favicon.png",
  "/assets/img/logoPS.png",
  "/assets/img/Imagen1.jpeg",
  "/assets/img/Imagen2.jpeg",
  "/assets/img/Imagen3.jpeg",
  "/assets/img/imf.jpg",
  "/assets/img/promime.jpg",
  "/assets/img/hidroelectricos.jpg",
  "/assets/img/solar.jpg",
  "/assets/img/autoconsumo.jpg"
];

// Instalación: cache de archivos estáticos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
  console.log("Service Worker instalado y archivos en caché");
});

// Activación: eliminar caches antiguas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
  console.log("Service Worker activo");
});

// Fetch: servir desde cache o red
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then(networkResponse => {
          // Solo cachear respuestas completas (status 200) y tipo básico
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseClone = networkResponse.clone(); // 👈 clon seguro
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }

          return networkResponse; // devolver el original
        })
        .catch(() => {
          // Fallback offline para documentos
          if (request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});




