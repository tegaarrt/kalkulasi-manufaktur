import type { NextConfig } from "next";

// Hasil build berupa file statis di folder out/ karena tidak ada backend lagi.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
