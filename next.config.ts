import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Smaller, self-contained production bundle for shared hosting (2 GB RAM).
  output: "standalone",

  // Reduce memory use during production runtime.
  poweredByHeader: false,
  compress: true,

  // Avoid extra build work on limited CPU hosts when building locally.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
