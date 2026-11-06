# E-CODAPROVE-26

Kalkulator PWA. Semua rumus berjalan di perangkat (`lib/kalkulasi.ts`), jadi aplikasi tetap bisa dipakai offline setelah dibuka sekali saat online.

## Menjalankan

    npm install
    npm run dev

## Mencoba hasil build dan PWA

    npm run build
    npm run preview

Service worker hanya aktif pada hasil build, bukan pada `npm run dev`.

## Deploy ke Vercel

Framework preset tetap Next.js, Root Directory mengarah ke folder ini. Folder `api/` lama tidak dipakai lagi.

## Ikon

Ganti file di `public/icons/` kalau punya logo berbentuk persegi. Ukuran tetap sama.
