import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-718687a71676443c97e5967ee3895315.r2.dev",
      },
    ],
  },
};

export default nextConfig;
