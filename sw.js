const CACHE_NAME = "secret-story-v3";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./nbrjoueurs.html",
  "./choisircarte.html",
  "./cartesecret.html",
  "./maingame.html",
  "./demanderindice.html",
  "./buzz.html",
  "./resultatbuzz.html",
  "./classement.html",
  "./debut.html",
  "./test.html",
  "./attente.html",
  "./reglesjeu.html",
  "./manifest.webmanifest",
  "./register-sw.js",
  "./assets/tailwind.css",
  "./assets/logo.png",
  "./assets/oeil.png",
  "./assets/oeil_indice.png",
  "./assets/roue.png",
  "./assets/key.png",
  "./assets/coffee.png",
  "./assets/secret.png",
  "./assets/siren.png",
  "./assets/indice1.mp3",
  "./assets/sounds/buzzer.mp3",
  "./assets/sounds/debut.mp3",
  "./assets/sounds/drum_roll.mp3",
  "./assets/sounds/swoosh.mp3",
  "./assets/sounds/stop.mp3",
  "./assets/sounds/nouvel_indice.mp3",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(ASSETS_TO_CACHE.map(url => cache.add(url)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && response.status === 200 && response.type === "basic") {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch (err) {
      return cached || Response.error();
    }
  })());
});
