// Ubah angka versi ini setiap kali kamu memperbarui isi aplikasi,
// supaya HP pengguna mengambil file yang baru.
const VERSI = "sahabat-orang-samaria-v2";
const FILE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((nama) => Promise.all(nama.filter((n) => n !== VERSI).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cache) => {
      if (cache) return cache;
      return fetch(e.request)
        .then((res) => {
          const salinan = res.clone();
          caches.open(VERSI).then((c) => c.put(e.request, salinan));
          return res;
        })
        .catch(() => (e.request.mode === "navigate" ? caches.match("./index.html") : undefined));
    })
  );
});
