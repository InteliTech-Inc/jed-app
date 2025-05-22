import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        hostname: "ik.imagekit.io",
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "api.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
