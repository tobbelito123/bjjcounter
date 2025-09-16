// sw.js
const CACHE = "bjj-counter-v4"; // bump on each deploy
const ASSETS = [
  "/",                       // root
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install: cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // 1) For top-level navigations, try network → cache → offline shell
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        // Optionally cache the HTML for faster next load
        const copy = fresh.clone();
        if (fresh.ok) {
          caches.open(CACHE).then((c) => c.put("/", copy)); // keep the shell fresh
        }
        return fresh;
      } catch {
        // offline: serve cached shell if we have it
        const cached = await caches.match("/");
        return cached || new Response("Offline", { status: 503, statusText: "Offline" });
      }
    })());
    return;
  }

  // 2) For same-origin GETs (assets), use cache-first, then network
  if (req.method === "GET" && new URL(req.url).origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const res = await fetch(req);
        // cache only successful, non-opaque responses
        if (res && res.ok && res.type !== "opaque") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      } catch {
        // no cache, no network → let it fail
        return new Response("", { status: 504, statusText: "Gateway Timeout" });
      }
    })());
    return;
  }

  // 3) Everything else: just pass through
  // (cross-origin analytics, POSTs, etc.)
});
