/* =========================================================
   SERVICE WORKER — Pocket Piano
   Kaam: app ki files pehli baar khulte hi cache me daalna,
   taaki internet band hone par bhi app chale.
   ========================================================= */

const CACHE_VERSION = "pocket-piano-v1";
const FONT_CACHE = "pocket-piano-fonts-v1";

/* App shell — ye files install hote hi cache ho jayengi */
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
];

/* 1) INSTALL — files download karke cache me daalo */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

/* 2) ACTIVATE — purane cache saaf karo */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION && k !== FONT_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* 3) FETCH — request pakad ke cache se ya network se jawab do */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  /* (a) Google Fonts — cache-first, kyunki ye kabhi nahi badalte */
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(req).then(
          (hit) =>
            hit ||
            fetch(req).then((res) => {
              cache.put(req, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  /* (b) Page khud — network-first, taaki update turant dikhe.
         Offline ho to cache se do. */
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() =>
          caches
            .match(req)
            .then((hit) => hit || caches.match("./index.html"))
        )
    );
    return;
  }

  /* (c) Baaki same-origin files — cache-first, phir network */
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && url.origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
