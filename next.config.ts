import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // ESLint kontrollerini build sırasında devre dışı bırak
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;