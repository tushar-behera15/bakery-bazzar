import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.uengage.io", "www.ambalacakes.com", "www.sharmispassions.com", "res.cloudinary.com"], // whitelist your image domain
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
