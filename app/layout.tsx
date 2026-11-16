import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import DaftarkanPWA from "./DaftarkanPWA";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-CODAPROV-26",
  description: "Quick Calculation Tools PT Berlindo Mitra Utama",
  applicationName: "E-CODAPROV-26",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "E-CODAPROV-26",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3250",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DaftarkanPWA />
        {children}
      </body>
    </html>
  );
}
