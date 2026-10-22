/* Ritas App – offline: Zwischenspeicher sofort, frisch aus dem Netz nachladen (höchstens 2,5 s warten).
   Nur eigene Dateien; fremde Anfragen (z. B. Wetter) gehen unverändert ins Netz. */
const C = "ritas-app-v16";
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-180.png"]))); self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;      // fremde Anfragen nicht anfassen
  const navi = e.request.mode === "navigate";
  e.respondWith((async () => {
    const cache = await caches.open(C), alt = await cache.match(e.request, { ignoreSearch: navi });
    const netz = fetch(e.request, { cache: "no-cache" }).then(r => { if (r.ok) cache.put(e.request, r.clone()); return r; }); // Fehlerseiten nicht cachen
    if (alt) { e.waitUntil(netz.catch(() => { })); return Promise.race([netz.then(r => r.ok ? r : alt), new Promise(res => setTimeout(() => res(alt), 2500))]).catch(() => alt); }
    try { return await netz; } catch (x) { return navi ? (await cache.match("./index.html")) || Response.error() : Response.error(); }
  })());
});
