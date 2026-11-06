// Ganti versi ini hanya kalau logika service worker berubah.
const CACHE = "ecodaprove-v1";
const HALAMAN = "/";
const ASET_TETAP = [
  "/logo.png",
  "/logo-berlindo.png",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Simpan halaman beserta semua CSS dan JS yang dipakainya sekaligus.
// Kalau ada yang gagal, instalasi batal, jadi HP tidak memegang tampilan setengah jadi.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const res = await fetch(HALAMAN, { cache: "reload" });
      if (!res.ok) throw new Error("Halaman gagal dimuat");
      const html = await res.clone().text();
      const aset = [...html.matchAll(/(?:href|src)="(\/_next\/static\/[^"]+)"/g)].map((m) =>
        m[1].replace(/&amp;/g, "&")
      );
      const cache = await caches.open(CACHE);
      await cache.addAll([...new Set([...ASET_TETAP, ...aset])]);
      await cache.put(HALAMAN, res);
      await self.skipWaiting();
    })()
  );
});

// Hapus cache lama, termasuk milik PWA versi sebelumnya yang membuat tampilan rusak.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const nama = await caches.keys();
      await Promise.all(nama.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
      await self.clients.claim();
    })()
  );
});

async function simpan(request, response) {
  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

// Halaman: utamakan versi terbaru, pakai simpanan saat offline.
async function dariJaringanDulu(request) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(HALAMAN, res.clone());
    }
    return res;
  } catch {
    const tersimpan = await caches.match(HALAMAN);
    return tersimpan || Response.error();
  }
}

// /_next/static/ memakai nama file ber-hash, jadi isinya tidak pernah berubah.
async function dariCacheDulu(request) {
  const tersimpan = await caches.match(request);
  return tersimpan || simpan(request, await fetch(request));
}

// Logo dan ikon: tampilkan simpanan, lalu perbarui di belakang layar.
async function dariCacheLaluPerbarui(request) {
  const tersimpan = await caches.match(request);
  const terbaru = fetch(request)
    .then((res) => simpan(request, res))
    .catch(() => null);
  if (tersimpan) return tersimpan;
  return (await terbaru) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(dariJaringanDulu(request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(dariCacheDulu(request));
  } else {
    event.respondWith(dariCacheLaluPerbarui(request));
  }
});
