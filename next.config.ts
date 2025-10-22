import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.uengage.io", "www.ambalacakes.com", "www.sharmispassions.com"], // whitelist your image domain
  },
};

export default nextConfig;
