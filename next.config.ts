import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "cdn.uengage.io" },
      { hostname: "www.ambalacakes.com" },
      { hostname: "www.sharmispassions.com" },
      { hostname: "res.cloudinary.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://bake-server.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
