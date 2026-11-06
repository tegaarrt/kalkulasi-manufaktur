"use client";
import { useEffect } from "react";

export default function DaftarkanPWA() {
  useEffect(() => {
    // Hanya di production, supaya cache tidak mengganggu saat `next dev`.
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Service worker gagal didaftarkan", err);
      });
    }
  }, []);

  return null;
}
