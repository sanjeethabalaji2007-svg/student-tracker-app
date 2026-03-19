const CACHE_NAME = "student-tracker-cache-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./src/app.js",
  "./src/util.js",
  "./src/db.js",
  "./src/crypto.js",
  "./src/auth.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(ASSETS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req, { ignoreSearch: true });
      if (cached) {
        // update in background
        event.waitUntil(
          (async () => {
            try {
              const fresh = await fetch(req);
              if (fresh.ok) await cache.put(req, fresh.clone());
            } catch {
              // ignore
            }
          })()
        );
        return cached;
      }
      try {
        const fresh = await fetch(req);
        if (fresh.ok) await cache.put(req, fresh.clone());
        return fresh;
      } catch {
        // fallback to index for navigations
        if (req.mode === "navigate") return (await cache.match("./index.html")) || new Response("Offline", { status: 503 });
        return new Response("Offline", { status: 503 });
      }
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const existing = allClients.find((c) => "focus" in c);
      if (existing) {
        await existing.focus();
        return;
      }
      if (self.clients.openWindow) await self.clients.openWindow("./index.html");
    })()
  );
});

