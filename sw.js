/* Ritas App – offline: erst Netz (immer frisch), sonst Zwischenspeicher */
const C = "ritas-app-v8";
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-180.png"]))); self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const frisch = e.request.mode === "navigate" || /\/(index\.html|post\.json)?$/.test(new URL(e.request.url).pathname);
  e.respondWith(fetch(e.request, frisch ? { cache: "no-cache" } : {}).then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
